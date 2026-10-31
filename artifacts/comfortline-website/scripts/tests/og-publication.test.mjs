import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const names = ["first-ru.jpg", "first-en.jpg", "second-ru.jpg", "second-en.jpg"];

function snapshot(dir) {
  return fs.readdirSync(dir, { recursive: true }).sort().map((name) => {
    const target = path.join(dir, name);
    return [name, fs.statSync(target).isDirectory() ? null : fs.readFileSync(target)];
  });
}

function fixture(t, { existing, failure }) {
  // Copy production code, never symlink: every injected dependency, image,
  // partial write and cleanup operation is confined to this temporary tree.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "og-publication-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  function write(name, content) {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  for (const name of [
    "scripts/og-images.mjs", "scripts/lib/og-fonts.mjs",
    "scripts/lib/og-text-layout.mjs", "scripts/fonts",
  ]) {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(path.join(root, name), target, { recursive: true });
  }
  write("scripts/route-manifest.mjs", `
    export function collectAllRoutes() {
      return { allRoutes: ["first", "second"].map(ogSlug => ({
        ogSlug, titleRu: "Русский заголовок", titleEn: "English title",
        descRu: "Описание", descEn: "Description",
        pathRu: "/" + ogSlug, pathEn: "/en/" + ogSlug,
      })) };
    }
  `);
  write("src/seo/seo-config.ts", 'export const BUSINESS = { phoneDisplay: "+000" };');
  write("node_modules/sharp/package.json", JSON.stringify({ type: "module", exports: "./index.mjs" }));
  write("node_modules/sharp/index.mjs", `
    import fs from "node:fs";
    import path from "node:path";
    const failure = ${JSON.stringify(failure)};
    const output = ${JSON.stringify(path.join(dir, "dist/public"))};
    const original = ${JSON.stringify(existing
      ? Object.fromEntries([...names, "obsolete.jpg"].map(name => [name, `old:${name}`]))
      : null)};
    const rename = fs.renameSync;
    fs.renameSync = (from, to) => {
      if (failure === "publish" && path.basename(from) === "next") {
        throw new Error("INJECTED_PUBLICATION_FAILURE");
      }
      return rename(from, to);
    };
    let calls = 0;
    export default function sharp() {
      return { jpeg(options) {
        if (options.quality !== 90 || options.mozjpeg !== true) throw new Error("JPEG options changed");
        return { async toFile(target) {
          calls++;
          // The previous set must remain untouched throughout every render.
          const og = path.join(output, "og");
          const current = fs.existsSync(og)
            ? Object.fromEntries(fs.readdirSync(og).map(name => [name, fs.readFileSync(path.join(og, name), "utf8")]))
            : null;
          if (JSON.stringify(current && Object.entries(current).sort()) !==
              JSON.stringify(original && Object.entries(original).sort())) {
            throw new Error("PREVIOUS_IMAGES_CHANGED_DURING_RENDER");
          }
          fs.writeFileSync(target, "new:" + path.basename(target));
          fs.appendFileSync(${JSON.stringify(path.join(dir, "render-calls"))}, path.basename(target) + "\\n");
          if (failure === "render" && calls === 3) throw new Error("INJECTED_MID_RENDER_FAILURE");
        } };
      } };
    }
  `);
  write("dist/public/keep.txt", "unrelated build output");
  if (existing) {
    for (const name of [...names, "obsolete.jpg"]) write(`dist/public/og/${name}`, `old:${name}`);
  }
  const output = path.join(dir, "dist/public");
  return {
    output, dir,
    run: () => spawnSync(process.execPath, ["scripts/og-images.mjs"], {
      cwd: dir, encoding: "utf8", timeout: 30_000,
      env: { ...process.env, HOME: dir, XDG_CACHE_HOME: path.join(dir, "cache") },
    }),
  };
}

for (const existing of [false, true]) {
  for (const failure of ["render", "publish"]) {
    test(`${failure} failure preserves ${existing ? "existing previews" : "a clean build"} and cleans staging`, (t) => {
      const f = fixture(t, { existing, failure });
      const before = snapshot(f.output);
      const result = f.run();
      assert.ifError(result.error);
      assert.equal(result.signal, null);
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, failure === "render" ? /INJECTED_MID_RENDER_FAILURE/ : /INJECTED_PUBLICATION_FAILURE/);
      assert.doesNotMatch(result.stdout, /\[og\] generated/);
      assert.deepEqual(fs.readFileSync(path.join(f.dir, "render-calls"), "utf8").trim().split("\n"),
        failure === "render" ? names.slice(0, 3) : names,
        "failure must happen after real staged writes, not during setup");
      assert.deepEqual(snapshot(f.output), before, "all prior bytes and directory entries must be unchanged");
    });
  }

  test(`successful generation publishes the complete set (${existing ? "replacement" : "first build"})`, (t) => {
    const f = fixture(t, { existing, failure: null });
    const result = f.run();
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /\[og\] generated 4 OG images/);
    assert.deepEqual(fs.readdirSync(f.output).sort(), ["keep.txt", "og"]);
    assert.equal(fs.readFileSync(path.join(f.output, "keep.txt"), "utf8"), "unrelated build output");
    assert.deepEqual(fs.readdirSync(path.join(f.output, "og")).sort(), [...names].sort());
    for (const name of names) {
      assert.equal(fs.readFileSync(path.join(f.output, "og", name), "utf8"), `new:${name}`);
    }
  });
}
