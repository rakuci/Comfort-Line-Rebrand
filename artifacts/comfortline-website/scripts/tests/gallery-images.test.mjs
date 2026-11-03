import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../../src/lib/gallery-images.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { galleryImageProps, GALLERY_SIZES } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("destination originals map to three WebP candidates and a bounded fallback", () => {
  for (const extension of ["png", "jpg", "jpeg"]) {
    assert.deepEqual(galleryImageProps(`/img/kaunas/old-town.${extension}`), {
      src: "/img/kaunas/old-town-800.webp",
      srcSet: "/img/kaunas/old-town-400.webp 400w, /img/kaunas/old-town-800.webp 800w, /img/kaunas/old-town-1200.webp 1200w",
      sizes: GALLERY_SIZES,
    });
  }
});

test("existing WebP, remote URLs and non-gallery images are not rewritten", () => {
  for (const src of ["/img/warsaw/warsaw-old-town.webp", "/logo.png", "https://example.com/photo.png"]) {
    assert.deepEqual(galleryImageProps(src), { src });
  }
});

test("sizes track the one/two/three-column grid and max-w-4xl container", () => {
  assert.equal(GALLERY_SIZES,
    "(min-width: 1024px) 272px, (min-width: 896px) 416px, (min-width: 768px) calc((100vw - 64px) / 2), (min-width: 640px) calc((100vw - 48px) / 2), calc(100vw - 32px)");
});

test("development generates ignored image variants without optional lifecycle hooks", () => {
  const pkg = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  assert.match(pkg.scripts.dev, /^node scripts\/convert-images\.mjs && vite\b/);
  assert.ok(!pkg.scripts.predev, "generation belongs in dev itself, not an optional pnpm hook");
});
