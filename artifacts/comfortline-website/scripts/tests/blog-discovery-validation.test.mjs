import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createDataLoader } from "../lib/load-blog-data.mjs";
import { collectAllRoutes } from "../route-manifest.mjs";
import { extractArticles, regenerateSitemap } from "../generate-blog-sitemap.mjs";
import { planOgImages, svgFor } from "../og-images.mjs";
import {
  validateDiscoveryIdentities, validateBlogSitemap, validateBlogImagePlan,
  validateBlogShareDocument, validateGeneratedBlogDiscovery,
} from "../lib/blog-discovery-validation.mjs";
import { EXPECTED_ORIGIN } from "../fixtures/blog-policy-expectations.mjs";

const { ARTICLES } = createDataLoader()("blog-articles");
const routes = collectAllRoutes().blogArticleRoutes;
const images = planOgImages(routes);
const article = ARTICLES[0];
const ruUrl = new URL(`/блог/${article.slug}`, EXPECTED_ORIGIN).href;
const enUrl = `${EXPECTED_ORIGIN}/blog/${article.slugEn}`;
const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const source = readFileSync(new URL("../../src/data/blog-articles.ts", import.meta.url), "utf8");
const generated = regenerateSitemap(sitemap, extractArticles(source));

test("actual generator XML agrees with real TS data, not its own parser", () => {
  validateDiscoveryIdentities(ARTICLES);
  validateBlogSitemap(generated, ARTICLES);
  assert.equal(regenerateSitemap(generated, extractArticles(source)), generated, "Generator must be deterministic");
});
test("regeneration removes stale article URLs and leaves non-article entries unchanged", () => {
  const stale = generated.replace(enUrl, `${enUrl}-old`);
  assert.equal(regenerateSitemap(stale, extractArticles(source)), generated);
  const nonBlog = (xml) => [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map(([block]) => block).filter((block) => !/\/(?:blog|%D0%B1%D0%BB%D0%BE%D0%B3)\//.test(block));
  assert.deepEqual(nonBlog(generated), nonBlog(sitemap));
});
test("unmodified articles retain publication lastmod; updated articles retain their newer editorial date", () => {
  assert.ok(ARTICLES.some((a) => !a.dateModified));
  assert.ok(ARTICLES.some((a) => a.dateModified > a.dateISO));
  validateBlogSitemap(generated, ARTICLES);
  assert.throws(() => regenerateSitemap(sitemap, [{ slug: "test", slugEn: "test" }]), /Missing article date/);
});
for (const [name, from, to, expected] of [
  ["EN loc using Russian translation", `<loc>${enUrl}</loc>`, `<loc>${ruUrl}</loc>`, /localized URL/],
  ["stale localized slug", `<loc>${enUrl}</loc>`, `<loc>${enUrl}-old</loc>`, /localized URL/],
  ["nonreciprocal EN alternate", `hreflang="en" href="${enUrl}"`, `hreflang="en" href="${ruUrl}"`, /en alternate target/],
  ["nonreciprocal RU alternate", `hreflang="ru" href="${ruUrl}"`, `hreflang="ru" href="${enUrl}"`, /ru alternate target/],
  ["wrong default language", `hreflang="x-default" href="${ruUrl}"`, `hreflang="x-default" href="${enUrl}"`, /x-default alternate target/],
  ["stale lastmod", `<lastmod>${article.dateModified}</lastmod>`, `<lastmod>${article.dateISO}</lastmod>`, /lastmod/],
  ["build day replacing editorial date", `<lastmod>${article.dateModified}</lastmod>`, "<lastmod>2099-01-01</lastmod>", /lastmod/],
  ["missing alternate", `      <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`, "", /alternatives/],
]) {
  test(`sitemap rejects ${name}`, () => {
    const changed = generated.replace(from, to);
    assert.notEqual(changed, generated, "Mutation must apply");
    assert.throws(() => validateBlogSitemap(changed, ARTICLES), expected);
  });
}
test("sitemap rejects missing, duplicate and orphan article entries", () => {
  const block = generated.match(/<url>[\s\S]*?<\/url>/g).find((block) => block.includes(`<loc>${enUrl}</loc>`));
  for (const xml of [
    generated.replace(block, ""),
    generated.replace(block, block + block),
    generated.replace(block, block + block.replaceAll(enUrl, `${enUrl}-orphan`)),
  ]) assert.throws(() => validateBlogSitemap(xml, ARTICLES), /inventory/);
});
test("malformed sitemap XML fails rather than partially passing", () => {
  assert.throws(() => validateBlogSitemap(generated.replace("</urlset>", ""), ARTICLES));
});
test("preserved social and publication identities cannot drift together with output", () => {
  for (const key of ["slugEn", "ogSlug", "dateISO"]) {
    const articles = structuredClone(ARTICLES);
    articles[0][key] = "changed";
    assert.throws(() => validateDiscoveryIdentities(articles), /publication identities/);
  }
});
test("real share generator plans correct paths and locale-specific text without generating images", () => {
  validateBlogImagePlan(ARTICLES, routes, images);
  for (const image of images) {
    const svg = svgFor(image, "test");
    assert.ok(svg.includes('width="1200" height="630"'));
    const titleText = [...svg.matchAll(/<tspan[^>]*>(.*?)<\/tspan>/g)]
      .map(([, text]) => text).join(" ");
    assert.ok(titleText.includes(image.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;")));
  }
});
for (const [name, mutate, expected] of [
  ["wrong-language filename", (r, i) => { i[1].imagePath = i[0].imagePath; }, /share-image target/],
  ["stale share slug", (r, i) => { i[0].imagePath = "/og/stale-ru.jpg"; }, /share-image target/],
  ["Russian English overlay", (r, i) => { i[1].title = i[0].title; }, /title language/],
  ["Russian English subtitle", (r, i) => { i[1].subtitle = i[0].subtitle; }, /subtitle language/],
  ["missing image plan", (r, i) => { i.pop(); }, /inventory/],
  ["parser English route drift", (r) => { r[0].pathEn = r[0].pathRu; }, /English path/],
  ["parser image identity drift", (r) => { r[0].ogSlug = "old"; }, /image identity/],
  ["publication replaced by update", (r) => { r[0].datePublished = r[0].dateModified; }, /publication date/],
  ["update replaced by publication", (r) => { r[0].dateModified = r[0].datePublished; }, /modification date/],
]) {
  test(`share plan rejects ${name}`, () => {
    const r = structuredClone(routes);
    const i = structuredClone(images);
    mutate(r, i);
    assert.throws(() => validateBlogImagePlan(ARTICLES, r, i), expected);
  });
}
const imageUrl = `${EXPECTED_ORIGIN}/og/${article.ogSlug}-en.jpg`;
const shareHtml = `<html><head>
<meta property="og:url" content="${enUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:secure_url" content="${imageUrl}">
<meta name="twitter:image" content="${imageUrl}">
<meta property="article:published_time" content="${article.dateISO}">
<meta property="article:modified_time" content="${article.dateModified}">
<script type="application/ld+json">${JSON.stringify({ "@type": "Article", image: { url: imageUrl } })}</script>
</head><body></body></html>`;
test("complete generated social metadata passes", () => validateBlogShareDocument(shareHtml, article, "en"));
for (const [name, from, to] of [
  ["wrong og:url locale", enUrl, ruUrl],
  ["wrong og:image locale", `property="og:image" content="${imageUrl}"`, `property="og:image" content="${imageUrl.replace("-en.jpg", "-ru.jpg")}"`],
  ["fallback secure image", `property="og:image:secure_url" content="${imageUrl}"`, 'property="og:image:secure_url" content="https://comfortline.by/opengraph.jpg"'],
  ["unsuffixed Twitter image", `name="twitter:image" content="${imageUrl}"`, `name="twitter:image" content="${imageUrl.replace("-en.jpg", ".jpg")}"`],
  ["stale structured image", `"url":"${imageUrl}"`, `"url":"${imageUrl.replace("-en.jpg", ".jpg")}"`],
  ["publication changed to modification", `published_time" content="${article.dateISO}"`, `published_time" content="${article.dateModified}"`],
  ["stale modified time", `modified_time" content="${article.dateModified}"`, `modified_time" content="${article.dateISO}"`],
]) {
  test(`generated social metadata rejects ${name}`, () => {
    const changed = shareHtml.replace(from, to);
    assert.notEqual(changed, shareHtml);
    assert.throws(() => validateBlogShareDocument(changed, article, "en"), /share/);
  });
}
test("generated checks fail explicitly on missing and invalid images; no JPEG generation in tests", async () => {
  const temp = mkdtempSync(join(tmpdir(), "blog-discovery-"));
  try {
    writeFileSync(join(temp, "sitemap.xml"), generated);
    await assert.rejects(validateGeneratedBlogDiscovery(ARTICLES, temp), /Input file is missing/);
    mkdirSync(join(temp, "og"));
    writeFileSync(join(temp, `og/${article.ogSlug}-ru.jpg`), "not a JPEG");
    await assert.rejects(validateGeneratedBlogDiscovery(ARTICLES, temp), /unsupported image format/);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
