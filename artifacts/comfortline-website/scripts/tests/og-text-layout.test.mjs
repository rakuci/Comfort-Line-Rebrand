import assert from "node:assert/strict";
import { test } from "node:test";
import { collectAllRoutes } from "../route-manifest.mjs";
import { planOgImages, svgFor, textFor } from "../og-images.mjs";
import { fitText, layoutOgText, measureText, OG_TEXT_BOUNDS as bounds } from "../lib/og-text-layout.mjs";

const routes = collectAllRoutes().allRoutes;
const images = planOgImages(routes);
const options = { maxWidth: bounds.width, maxLines: 3, maxFontSize: 60, minFontSize: 44 };
const compact = (text) => text.replace(/\s/gu, "");

function checkLayout(image) {
  const layout = layoutOgText(image);
  assert.deepEqual(layout, layoutOgText(image), "layout must be deterministic");
  for (const [key, maxLines, minFontSize, maxFontSize] of [
    ["title", 3, 44, 60], ["subtitle", 2, 25, 30],
  ]) {
    const block = layout[key];
    assert.ok(block.lines.length <= maxLines, `${image.imagePath}: ${key} line limit`);
    assert.ok(block.fontSize >= minFontSize && block.fontSize <= maxFontSize);
    assert.equal(compact(block.lines.map((line) => line.text).join("")), compact(image[key]),
      `${image.imagePath}: ${key} must retain all text, including the existing subtitle ellipsis`);
    for (const [index, line] of block.lines.entries()) {
      assert.equal(line.x, bounds.x);
      assert.ok(line.width <= bounds.width, `${image.imagePath}: ${key} horizontal overflow`);
      assert.ok(line.y - block.fontSize >= bounds.top);
      assert.ok(line.y + (block.lineHeight - block.fontSize) <= bounds.bottom);
      if (index) assert.equal(line.y - block.lines[index - 1].y, block.lineHeight);
    }
  }
  const lastTitle = layout.title.lines.at(-1);
  const firstSubtitle = layout.subtitle.lines[0];
  if (firstSubtitle) {
    assert.ok(firstSubtitle.y - layout.subtitle.fontSize
      - (lastTitle.y + layout.title.lineHeight - layout.title.fontSize) >= bounds.gap);
  }
  return layout;
}

test("all real RU/EN transfer, fleet, blog and other image plans fit without losing copy", () => {
  assert.ok(images.length > 100);
  for (const image of images) checkLayout(image);
});

test("long Warsaw airport titles wrap; localized identities and filenames do not change", () => {
  const titles = {
    ru: "Индивидуальный трансфер Минск — Аэропорт Варшавы Шопен",
    en: "Private Transfer Minsk — Warsaw Chopin Airport (WAW)",
  };
  for (const lang of ["ru", "en"]) {
    const image = images.find((image) => image.imagePath === `/og/minsk-warsaw-airport-${lang}.jpg`);
    assert.equal(image.title, titles[lang]);
    assert.ok(measureText(image.title, 60) > bounds.width, "old single-line layout would overflow");
    const layout = checkLayout(image);
    assert.ok(layout.title.lines.length > 1);
    assert.ok(layout.subtitle.lines.length > 1);
  }
  for (const route of routes.filter((route) => route.ogSlug)) {
    for (const lang of ["ru", "en"]) {
      const image = images.find((image) => image.imagePath === `/og/${route.ogSlug}-${lang}.jpg`);
      assert.deepEqual({ title: image.title, subtitle: image.subtitle }, textFor(route, lang));
    }
  }
});

test("short copy stays large; empty subtitles leave no phantom lines", () => {
  const layout = checkLayout({ title: "ComfortLine", subtitle: "", imagePath: "short" });
  assert.equal(layout.title.fontSize, 60);
  assert.equal(layout.title.lines.length, 1);
  assert.deepEqual(layout.subtitle.lines, []);
});

test("width, not character count, determines wrapping and font fitting", () => {
  assert.ok(measureText("Ш".repeat(20), 60) > measureText("i".repeat(20), 60));
  assert.equal(fitText("i".repeat(30), options).lines.length, 1);
  assert.ok(fitText("Ш".repeat(30), options).lines.length > 1);
  const fitted = fitText("Ш".repeat(50), options);
  assert.ok(fitted.fontSize < 60 && fitted.fontSize >= 44);
  assert.ok(fitted.lines.length <= 3);
  assert.equal(fitted.lines.join(""), "Ш".repeat(50));
  const subtitle = fitText("W".repeat(60), {
    maxWidth: bounds.width, maxLines: 2, maxFontSize: 30, minFontSize: 26,
  });
  assert.ok(subtitle.fontSize < 30 && subtitle.fontSize >= 26);
});

test("oversized words, mixed scripts and combining accents retain characters", () => {
  for (const title of [
    "Supercalifragilisticexpialidocious".repeat(3),
    "ОченьДлинноеНазваниеБезПробелов".repeat(2),
    "Минск — Warsaw (WAW) / Вильнюс & Vilnius: 2026",
    "Cafe\u0301 ".repeat(18),
  ]) checkLayout({ title, subtitle: "Русский / English", imagePath: title });
  assert.equal(measureText("e\u0301", 60), measureText("e", 60));
});

test("unfittable copy and invalid bounds fail explicitly rather than clipping or truncating", () => {
  assert.throws(() => layoutOgText({ title: "W".repeat(1000), subtitle: "" }), /cannot fit/);
  assert.throws(() => layoutOgText({ title: "Title", subtitle: "W".repeat(1000) }), /cannot fit/);
  assert.throws(() => layoutOgText({ title: " ", subtitle: "" }), /must not be empty/);
  assert.throws(() => fitText("test", { ...options, maxWidth: 0 }), /Invalid/);
  assert.throws(() => fitText("test", { ...options, minFontSize: 70 }), /Invalid/);
});

test("SVG uses the planned positions, sizes and XML escaping without rendering JPEGs", () => {
  const image = {
    title: 'Минск & Warsaw <Airport> "WAW" \'VNO\'',
    subtitle: "English & русский <text>",
  };
  const layout = layoutOgText(image);
  const svg = svgFor(image, "+375 & <phone>");
  assert.ok(svg.includes('width="1200" height="630"'));
  assert.ok(svg.includes('font-size="60"'));
  for (const block of [layout.title, layout.subtitle]) {
    for (const line of block.lines) assert.ok(svg.includes(`<tspan x="${line.x}" y="${line.y}">`));
  }
  for (const escaped of ["&amp;", "&lt;Airport&gt;", "&quot;WAW&quot;", "&apos;VNO&apos;", "&lt;phone&gt;"]) {
    assert.ok(svg.includes(escaped), escaped);
  }
  assert.ok(!svg.includes("<Airport>"));
});
