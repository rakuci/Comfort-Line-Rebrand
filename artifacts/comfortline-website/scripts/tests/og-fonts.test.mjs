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
