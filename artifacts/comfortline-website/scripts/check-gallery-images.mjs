import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { JSDOM } from "jsdom";

// Validate shipped HTML and shipped assets, not just files left in public/.
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist/public");
assert.ok(fs.existsSync(dist), "Build the website before checking gallery delivery");
const requiredDestinations = ["kaunas", "palanga", "druskininkai", "katowice", "daugavpils", "jurmala"];
const covered = new Set();
const assets = new Map();
const originals = new Set();
const budget = { 400: 100 * 1024, 800: 250 * 1024, 1200: 500 * 1024 };
let galleries = 0;
let imageCount = 0;

for (const file of fs.readdirSync(dist, { recursive: true }).filter((file) => file.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(dist, file), "utf8");
  if (!html.includes("<figure")) continue;
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    const images = document.querySelectorAll('figure img[src^="/img/"]');
    if (images.length) galleries++;
    for (const image of images) {
      imageCount++;
      const src = image.getAttribute("src");
      assert.ok(!/\.(png|jpe?g)$/i.test(src), `${file}: gallery requests original ${src}`);
      assert.equal(image.loading || image.getAttribute("loading"), "lazy", `${file}: lazy loading`);
      assert.equal(image.getAttribute("decoding"), "async", `${file}: asynchronous decoding`);
      assert.equal(image.getAttribute("width"), "800", `${file}: intrinsic width`);
      assert.equal(image.getAttribute("height"), "533", `${file}: intrinsic height`);
      const caption = image.closest("figure").querySelector("figcaption")?.textContent.trim();
      assert.ok(caption, `${file}: descriptive caption`);
      assert.equal(image.alt, caption, `${file}: alt preserves localized caption`);
      if (!/-800\.webp$/.test(src)) continue; // Existing optimized WebP images.

      const destination = src.split("/")[2];
      covered.add(`${destination}:${document.documentElement.lang}`);
      const base = src.replace(/-800\.webp$/, "");
      const original = `${base}.png`;
      // Current route sources are PNG; retain the original only for size comparison.
      if (fs.existsSync(path.join(root, "public", original))) originals.add(original);
      assert.equal(image.getAttribute("sizes"),
        "(min-width: 1024px) 272px, (min-width: 896px) 416px, (min-width: 768px) calc((100vw - 64px) / 2), (min-width: 640px) calc((100vw - 48px) / 2), calc(100vw - 32px)",
        `${file}: sizes must match gallery layout`);
      const candidates = image.getAttribute("srcset")?.split(",").map((candidate) => candidate.trim());
      assert.deepEqual(candidates, [400, 800, 1200].map((width) => `${base}-${width}.webp ${width}w`),
        `${file}: complete responsive candidates`);
      for (const width of [400, 800, 1200]) {
        const url = `${base}-${width}.webp`;
        if (assets.has(url)) continue;
        const assetPath = path.join(dist, url);
        assert.ok(fs.existsSync(assetPath), `${file}: missing shipped asset ${url}`);
        const bytes = fs.statSync(assetPath).size;
        const metadata = await sharp(assetPath).metadata();
        assert.equal(metadata.format, "webp", `${url}: format`);
        assert.equal(metadata.width, width, `${url}: truthful srcset descriptor`);
        assert.ok(bytes <= budget[width], `${url}: ${bytes} bytes exceeds ${budget[width]} budget`);
        assets.set(url, bytes);
      }
    }
  } finally {
    dom.window.close();
  }
}
for (const destination of requiredDestinations) {
  for (const lang of ["ru", "en"]) {
    assert.ok(covered.has(`${destination}:${lang}`), `Missing generated ${lang} gallery for ${destination}`);
  }
}
const originalBytes = [...originals].reduce((sum, url) => sum + fs.statSync(path.join(root, "public", url)).size, 0);
console.log(`[gallery] Verified ${imageCount} images across ${galleries} generated pages; ${assets.size} WebP candidates.`);
for (const width of [400, 800, 1200]) {
  const selected = [...assets].filter(([url]) => url.endsWith(`-${width}.webp`));
  const bytes = selected.reduce((sum, [, size]) => sum + size, 0);
  console.log(`[gallery] ${width}w: ${bytes.toLocaleString("en-US")} bytes total; largest ${Math.max(...selected.map(([, size]) => size)).toLocaleString("en-US")} bytes; originals ${originalBytes.toLocaleString("en-US")} bytes.`);
}
