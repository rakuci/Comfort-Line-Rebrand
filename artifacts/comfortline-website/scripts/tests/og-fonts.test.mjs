import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OG_FONT_CONFIG, OG_FONT_DIR, OG_FONT_HASHES } from "../lib/og-fonts.mjs";
import { collectAllRoutes } from "../route-manifest.mjs";
import { planOgImages, svgFor } from "../og-images.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const images = planOgImages(collectAllRoutes().allRoutes);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

// Read the pinned TTFs' Unicode format-12 cmap directly; no system fonts,
// Python font packages, external commands, or network needed for coverage.
function unicodeGroups(ttf) {
  let cmap;
  for (let i = 0; i < ttf.readUInt16BE(4); i++) {
    const table = 12 + i * 16;
    if (ttf.toString("ascii", table, table + 4) === "cmap") cmap = ttf.readUInt32BE(table + 8);
  }
  assert.ok(cmap, "font has a cmap");
  for (let i = 0; i < ttf.readUInt16BE(cmap + 2); i++) {
    const record = cmap + 4 + i * 8;
    const subtable = cmap + ttf.readUInt32BE(record + 4);
    const platform = ttf.readUInt16BE(record);
    if ((platform === 0 || (platform === 3 && ttf.readUInt16BE(record + 2) === 10))
      && ttf.readUInt16BE(subtable) === 12) {
      return Array.from({ length: ttf.readUInt32BE(subtable + 12) }, (_, index) => {
        const group = subtable + 16 + index * 12;
        return [ttf.readUInt32BE(group), ttf.readUInt32BE(group + 4), ttf.readUInt32BE(group + 8)];
      });
    }
  }
  assert.fail("pinned font must have a full Unicode cmap");
}

test("both licensed font files match their pins and contain every current RU/EN glyph", () => {
  assert.match(fs.readFileSync(path.join(OG_FONT_DIR, "LICENSE.txt"), "utf8"), /Permission is hereby granted/);
  const copy = images.flatMap(({ title, subtitle }) => [title, subtitle]).join("")
    + "COMFORTLINE comfortline.by +0123456789()–—…€"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    + "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  for (const [name, expected] of Object.entries(OG_FONT_HASHES)) {
    const bytes = fs.readFileSync(path.join(OG_FONT_DIR, name));
    assert.equal(hash(bytes), expected, name);
    const groups = unicodeGroups(bytes);
    for (const char of new Set(copy)) {
      if (/\s/u.test(char)) continue;
      const code = char.codePointAt(0);
      assert.ok(groups.some(([start, end, glyph]) =>
        code >= start && code <= end && glyph + code - start !== 0), `${name} missing ${char} (U+${code.toString(16)})`);
    }
  }
});

test("all SVG text requests only the pinned family and real regular/bold weights", () => {
  for (const image of images) {
    const svg = svgFor(image, "+375 29 123-45-67");
    const families = [...svg.matchAll(/font-family="([^"]+)"/g)].map((match) => match[1]);
    const weights = [...svg.matchAll(/font-weight="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(families.length, 5);
    assert.deepEqual(new Set(families), new Set(["DejaVu Sans"]));
    assert.deepEqual(weights, ["700", "700", "400", "700", "400"]);
  }
});

test("isolated fontconfig selects the vendored files for both weights", (t) => {
  const available = spawnSync("fc-match", ["--version"]);
  if (available.error?.code === "ENOENT") return t.skip("fc-match not installed; native rendering still tested below");
  for (const [weight, name] of [["regular", "DejaVuSans.ttf"], ["bold", "DejaVuSans-Bold.ttf"]]) {
    const result = spawnSync("fc-match", ["-f", "%{file}", `DejaVu Sans:weight=${weight}`], {
      env: { ...process.env, FONTCONFIG_FILE: OG_FONT_CONFIG, FONTCONFIG_PATH: OG_FONT_DIR },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.realpathSync(result.stdout), fs.realpathSync(path.join(OG_FONT_DIR, name)));
  }
  const listed = spawnSync("fc-list", ["-f", "%{file}\n"], {
    env: { ...process.env, FONTCONFIG_FILE: OG_FONT_CONFIG, FONTCONFIG_PATH: OG_FONT_DIR },
    encoding: "utf8",
  });
  assert.equal(listed.status, 0, listed.stderr);
  assert.deepEqual(listed.stdout.trim().split("\n").map((file) => path.basename(file)).sort(),
    Object.keys(OG_FONT_HASHES).sort(), "no host fonts may enter the font set");
});

// Copy, never symlink, the production entrypoint and its local dependencies:
// every destructive fixture edit and every possible output stays in tmp.
function generatorFixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "og-font-failure-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const file of [
    "scripts/og-images.mjs",
    "scripts/route-manifest.mjs",
    "scripts/lib/og-fonts.mjs",
    "scripts/lib/og-text-layout.mjs",
    "scripts/fonts",
  ]) {
    const target = path.join(dir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(path.join(root, file), target, { recursive: true });
  }

  // A healthy-bundle control proves this trap is reachable. Broken bundles
  // must fail before sharp's module body (and thus fontconfig) can initialize.
  const sharpDir = path.join(dir, "node_modules/sharp");
  fs.mkdirSync(sharpDir, { recursive: true });
  fs.writeFileSync(path.join(sharpDir, "package.json"),
    JSON.stringify({ type: "module", exports: "./index.mjs" }));
  fs.writeFileSync(path.join(sharpDir, "index.mjs"), `
    import fs from "node:fs";
    fs.writeFileSync(new URL("../../renderer-loaded", import.meta.url), "loaded");
    throw new Error("TEST_RENDERER_REACHED");
  `);
  const output = path.join(dir, "dist/public");
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "keep.txt"), "unrelated build output");
  const run = () => spawnSync(process.execPath, ["scripts/og-images.mjs"], {
    cwd: dir, encoding: "utf8", timeout: 30_000,
    env: {
      ...process.env,
      HOME: dir, XDG_CACHE_HOME: path.join(dir, "cache"),
      // Even a valid inherited configuration must not bypass bundle checks.
      FONTCONFIG_FILE: OG_FONT_CONFIG, FONTCONFIG_PATH: OG_FONT_DIR,
    },
  });
  return { dir, output, run, rendererMarker: path.join(dir, "renderer-loaded") };
}

function outputSnapshot(dir) {
  return fs.readdirSync(dir, { recursive: true }).sort().map((file) => {
    const target = path.join(dir, file);
    return [file, fs.statSync(target).isDirectory() ? null : fs.readFileSync(target).toString("hex")];
  });
}

test("healthy fixture reaches the renderer trap through the real generator entrypoint", (t) => {
  const fixture = generatorFixture(t);
  const before = outputSnapshot(fixture.output);
  const result = fixture.run();
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /\[og\] failed: Error: TEST_RENDERER_REACHED/);
  assert.ok(fs.existsSync(fixture.rendererMarker), "renderer trap must actually execute");
  assert.deepEqual(outputSnapshot(fixture.output), before);
});

for (const name of [...Object.keys(OG_FONT_HASHES), "fonts.conf"]) {
  const failures = name === "fonts.conf" ? ["missing"] : ["missing", "modified"];
  for (const failure of failures) {
    for (const existingImages of [false, true]) {
      test(`${failure} ${name} stops generation before rendering (${existingImages ? "existing" : "clean"} images)`, (t) => {
        const fixture = generatorFixture(t);
        if (existingImages) {
          fs.mkdirSync(path.join(fixture.output, "og"));
          fs.writeFileSync(path.join(fixture.output, "og/existing-ru.jpg"), "existing preview bytes");
        }
        const before = outputSnapshot(fixture.output);
        const target = path.join(fixture.dir, "scripts/fonts", name);
        if (failure === "missing") {
          fs.unlinkSync(target);
        } else {
          const bytes = fs.readFileSync(target);
          bytes[bytes.length - 1] ^= 1;
          fs.writeFileSync(target, bytes);
        }

        const result = fixture.run();
        assert.ifError(result.error);
        assert.equal(result.signal, null, "must exit normally, not time out or crash");
        assert.equal(result.status, 1, result.stderr);
        assert.match(result.stderr, /\[og\] failed:/, "generator reports the failure");
        assert.ok(result.stderr.includes(name), "diagnostic names the broken bundle file");
        if (failure === "missing") {
          assert.match(result.stderr, /ENOENT.*no such file or directory/);
          assert.ok(result.stderr.includes(target), "diagnostic identifies the missing file's location");
        } else {
          assert.ok(result.stderr.includes(`OG font checksum mismatch: ${name}`),
            "diagnostic identifies the checksum failure");
        }
        assert.equal(fs.existsSync(fixture.rendererMarker), false, "sharp must not load");
        assert.equal(result.stdout, "", "must not log generated share images");
        assert.deepEqual(outputSnapshot(fixture.output), before,
          "must neither create images/directories nor overwrite existing output");
      });
    }
  }
}

test("fresh render processes with empty caches override inherited font settings identically", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-fonts-"));
  const script = `
    import { configureOgFonts } from "./scripts/lib/og-fonts.mjs";
    import { svgFor } from "./scripts/og-images.mjs";
    import { createHash } from "node:crypto";
    configureOgFonts();
    const { default: sharp } = await import("sharp");
    for (const title of ["Минск — Аэропорт Варшавы Шопен Ёё", "Minsk — Warsaw Chopin Airport (WAW)"]) {
      const svg = svgFor({ title, subtitle: "Русский / English €60 — 2026" }, "+375 29 123-45-67");
      const bytes = await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      console.log(createHash("sha256").update(bytes).digest("hex"));
    }
  `;
  try {
    const results = ["a", "b"].map((run) => {
      const home = path.join(tmp, run);
      fs.mkdirSync(home);
      const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
        cwd: root, encoding: "utf8", timeout: 30_000,
        env: {
          ...process.env, HOME: home, XDG_CACHE_HOME: path.join(home, "cache"),
          FONTCONFIG_FILE: path.join(home, "nonexistent.conf"), FONTCONFIG_PATH: home,
        },
      });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stderr, "", "no fontconfig warnings or missing-font fallbacks");
      return result.stdout.trim().split("\n");
    });
    assert.equal(results[0].length, 2);
    assert.notEqual(results[0][0], results[0][1], "localized previews differ");
    assert.deepEqual(results[0], results[1], "clean-cache JPEG hashes must match");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
