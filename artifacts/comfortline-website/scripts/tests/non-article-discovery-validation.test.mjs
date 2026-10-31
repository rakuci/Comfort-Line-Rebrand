import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { collectAllRoutes } from "../route-manifest.mjs";
import { planOgImages } from "../og-images.mjs";
import { collectNonArticleShareExpectations } from "../lib/non-article-share-expectations.mjs";
import {
  validateNonArticleImagePlan, validateNonArticleShareDocument, validateGeneratedNonArticleDiscovery,
} from "../lib/blog-discovery-validation.mjs";
import { EXPECTED_ORIGIN } from "../fixtures/blog-policy-expectations.mjs";

const expected = collectNonArticleShareExpectations();
const { allRoutes } = collectAllRoutes();
const images = planOgImages(allRoutes);
const representatives = [
  "/minsk-city-transfer", "/minsk-vilnius-airport", "/lithuania-transfer",
  "/europe-transfer", "/mercedes-v-class-transfer", "/mercedes-e-class-transfer", "/blog",
].map((path) => {
  const route = expected.find((r) => r.pathEn === path);
  assert.ok(route, `Missing protected share family: ${path}`);
  return route;
});
const copy = (value) => structuredClone(value);
const url = (path) => new URL(path, EXPECTED_ORIGIN).href;
function htmlFor(route, lang) {
  const image = url(`/og/${route.ogSlug}-${lang}.jpg`);
  return `<!doctype html><html><head>
    <meta property="og:url" content="${url(lang === "ru" ? route.pathRu : route.pathEn)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${lang === "ru" ? "ru_RU" : "en_US"}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:secure_url" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${image}">
  </head><body></body></html>`;
}

test("all transfer, country, fleet and blog-index plans agree with independent TSX source", () => {
  validateNonArticleImagePlan(expected, allRoutes, images);
});
for (const route of representatives) {
  const index = allRoutes.findIndex((r) => r.pathRu === route.pathRu);
  const imageIndex = images.findIndex((i) => i.routePath === route.pathEn);
  for (const [name, mutate, error] of [
    ["missing manifest route", (r) => r.splice(index, 1), /manifest missing/],
    ["duplicate manifest route", (r) => r.push(copy(r[index])), /manifest missing or duplicated/],
    ["wrong manifest English path", (r) => { r[index].pathEn = route.pathRu; }, /English path/],
    ["shared parser and plan slug drift", (r) => { r[index].ogSlug = "stale"; }, /image identity/],
    ["missing localized image", (r, i) => i.splice(imageIndex, 1), /plan missing/],
    ["duplicate localized image", (r, i) => i.push(copy(i[imageIndex])), /plan missing or duplicated/],
    ["wrong plan language", (r, i) => { i[imageIndex].lang = "ru"; }, /plan language/],
    ["Russian filename on English page", (r, i) => { i[imageIndex].imagePath = `/og/${route.ogSlug}-ru.jpg`; }, /share-image target|filename collision/],
    ["unsuffixed filename", (r, i) => { i[imageIndex].imagePath = `/og/${route.ogSlug}.jpg`; }, /share-image target/],
    ["wrong title", (r, i) => { i[imageIndex].title = route.h1Ru === route.h1En ? "Generic fleet" : route.h1Ru; }, /title language/],
    ["Russian subtitle", (r, i) => { i[imageIndex].subtitle = route.introRu; }, /subtitle language/],
    ["filename collision", (r, i) => i.push({ routePath: "/unrelated", imagePath: i[imageIndex].imagePath }), /filename collision/],
  ]) {
    test(`${route.pathEn}: rejects ${name}`, () => {
      const routes = copy(allRoutes);
      const plans = copy(images);
      mutate(routes, plans);
      assert.throws(() => validateNonArticleImagePlan([route], routes, plans), error);
    });
  }
  test(`${route.pathEn}: generator deduplication cannot hide a shared ogSlug`, () => {
    const routes = copy(allRoutes);
    routes[0].ogSlug = route.ogSlug;
    assert.throws(() => validateNonArticleImagePlan([route], routes, planOgImages(routes)), /plan missing/);
  });
  for (const lang of ["ru", "en"]) {
    const html = htmlFor(route, lang);
    test(`${route.pathEn} [${lang}]: complete share head passes`, () =>
      validateNonArticleShareDocument(html, route, lang));
    for (const key of ["og:image", "og:image:secure_url", "twitter:image"]) {
      const attr = key.startsWith("og:") ? "property" : "name";
      const tag = new RegExp(`<meta ${attr}="${key}" content="[^"]+">`);
      for (const [name, replacement] of [
        ["missing", ""],
        ["duplicate", (match) => match + match],
        ["fallback", `<meta ${attr}="${key}" content="${EXPECTED_ORIGIN}/opengraph.jpg">`],
        ["wrong locale", `<meta ${attr}="${key}" content="${url(`/og/${route.ogSlug}-${lang === "en" ? "ru" : "en"}.jpg`)}">`],
        ["stale unsuffixed", `<meta ${attr}="${key}" content="${url(`/og/${route.ogSlug}.jpg`)}">`],
      ]) {
        test(`${route.pathEn} [${lang}]: rejects ${name} ${key}`, () => {
          const changed = html.replace(tag, replacement);
          assert.notEqual(changed, html, "Mutation must apply");
          assert.throws(() => validateNonArticleShareDocument(changed, route, lang), /share|missing\/duplicate/);
        });
      }
    }
    for (const [from, to, error] of [
      [`content="${url(lang === "ru" ? route.pathRu : route.pathEn)}"`, `content="${url(lang === "en" ? route.pathRu : route.pathEn)}"`, /og:url/],
      ['content="1200"', 'content="600"', /og:image:width/],
      ['content="630"', 'content="315"', /og:image:height/],
      ['content="image/jpeg"', 'content="image/png"', /og:image:type/],
      ['content="summary_large_image"', 'content="summary"', /twitter:card/],
      ['content="website"', 'content="article"', /og:type/],
    ]) {
      test(`${route.pathEn} [${lang}]: rejects altered ${error}`, () => {
        const changed = html.replace(from, to);
        assert.notEqual(changed, html);
        assert.throws(() => validateNonArticleShareDocument(changed, route, lang), error);
      });
    }
  }
}

// Reuse committed JPEG bytes; edit only the SOF dimensions for metadata-reader
// tests. No decoding, resizing, SVG rendering or image generation in this suite.
function jpegHeader(width, height) {
  const bytes = Buffer.from(readFileSync(new URL("../../public/mosaic-vostok-panorama.jpg", import.meta.url)));
  let offset = 2;
  assert.equal(bytes.readUInt16BE(0), 0xffd8, "Static fixture must be JPEG");
  while (offset < bytes.length) {
    const marker = bytes.readUInt16BE(offset);
    if (marker === 0xffc0 || marker === 0xffc2) {
      bytes.writeUInt16BE(height, offset + 5);
      bytes.writeUInt16BE(width, offset + 7);
      return bytes;
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error("Static JPEG fixture lacks SOF");
}

test("generated checks read both localized files, reject missing/invalid/wrong-size/non-JPEG output and bad HTML offline", async () => {
  const dist = mkdtempSync(join(tmpdir(), "non-article-shares-"));
  const route = representatives[0];
  const image = (lang) => join(dist, "og", `${route.ogSlug}-${lang}.jpg`);
  const html = (lang) => join(dist, lang === "ru" ? route.pathRu : route.pathEn, "index.html");
  try {
    await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /missing or invalid.*share image/);
    mkdirSync(join(dist, "og"));
    for (const lang of ["ru", "en"]) {
      mkdirSync(join(dist, lang === "ru" ? route.pathRu : route.pathEn), { recursive: true });
      writeFileSync(image(lang), jpegHeader(1200, 630));
      writeFileSync(html(lang), htmlFor(route, lang));
    }
    await validateGeneratedNonArticleDiscovery([route], dist);
    for (const lang of ["ru", "en"]) {
      unlinkSync(image(lang));
      await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /missing or invalid.*share image/);
      writeFileSync(image(lang), "corrupt JPEG");
      await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /missing or invalid.*share image/);
      for (const dimensions of [[600, 630], [1200, 315]]) {
        writeFileSync(image(lang), jpegHeader(...dimensions));
        await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /1200×630 JPEG/);
      }
      // A static 1×1 PNG, renamed .jpg: format is checked, not just the suffix.
      writeFileSync(image(lang), Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64"));
      await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /1200×630 JPEG/);
      writeFileSync(image(lang), jpegHeader(1200, 630));
      unlinkSync(html(lang));
      await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /ENOENT/);
      writeFileSync(html(lang), htmlFor(route, lang).replace(/name="twitter:image"/, 'name="unused"'));
      await assert.rejects(validateGeneratedNonArticleDiscovery([route], dist), /twitter:image/);
      writeFileSync(html(lang), htmlFor(route, lang));
    }
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
