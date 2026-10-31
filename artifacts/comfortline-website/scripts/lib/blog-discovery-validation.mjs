import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import { ARTICLE_IDENTITIES, EXPECTED_ORIGIN } from "../fixtures/blog-policy-expectations.mjs";

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NS = "http://www.w3.org/1999/xhtml";
const urlFor = (path) => new URL(path, EXPECTED_ORIGIN).href;
const pathsFor = (article) => ({ ru: `/блог/${article.slug}`, en: `/blog/${article.slugEn}` });
const imageFor = (article, lang) => `/og/${article.ogSlug}-${lang}.jpg`;

export function validateDiscoveryIdentities(articles) {
  assert.deepEqual(
    articles.map((a) => [a.slug, a.slugEn, a.ogSlug, a.dateISO]).sort(),
    [...ARTICLE_IDENTITIES].sort(),
    "Discovery publication identities changed; review preserved baseline",
  );
  for (const article of articles) {
    for (const date of [article.dateISO, article.dateModified ?? article.dateISO]) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${article.slug}: invalid editorial date`);
      assert.equal(new Date(date).toISOString().slice(0, 10), date, `${article.slug}: invalid calendar date`);
    }
    assert.ok(!article.dateModified || article.dateModified >= article.dateISO,
      `${article.slug}: modification predates publication`);
  }
}

export function validateBlogSitemap(xml, articles) {
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  try {
    const doc = dom.window.document;
    assert.equal(doc.documentElement.localName, "urlset", "Sitemap root");
    assert.equal(doc.documentElement.namespaceURI, SITEMAP_NS, "Sitemap namespace");
    const entries = [...doc.getElementsByTagNameNS(SITEMAP_NS, "url")];
    const text = (entry, tag) => {
      const nodes = entry.getElementsByTagNameNS(SITEMAP_NS, tag);
      assert.equal(nodes.length, 1, `Sitemap entry needs one ${tag}`);
      return nodes[0].textContent.trim();
    };
    const blogEntries = entries.filter((entry) =>
      /^\/(?:блог|blog)\//.test(decodeURI(new URL(text(entry, "loc")).pathname)));
    assert.equal(blogEntries.length, articles.length * 2, "Sitemap article inventory differs");
    for (const article of articles) {
      const paths = pathsFor(article);
      const expected = { ru: urlFor(paths.ru), en: urlFor(paths.en), "x-default": urlFor(paths.ru) };
      for (const lang of ["ru", "en"]) {
        const label = `${article.slug} [${lang}]`;
        const matches = blogEntries.filter((entry) => text(entry, "loc") === expected[lang]);
        assert.equal(matches.length, 1, `${label}: sitemap localized URL missing or duplicated`);
        const entry = matches[0];
        assert.equal(text(entry, "lastmod"), article.dateModified || article.dateISO,
          `${label}: sitemap lastmod must use update date, otherwise publication date`);
        const links = [...entry.getElementsByTagNameNS(XHTML_NS, "link")];
        assert.equal(links.length, 3, `${label}: sitemap alternatives missing or duplicated`);
        for (const [language, href] of Object.entries(expected)) {
          const linksForLang = links.filter((link) => link.getAttribute("hreflang") === language);
          assert.equal(linksForLang.length, 1, `${label}: sitemap ${language} alternate missing or duplicated`);
          assert.equal(linksForLang[0].getAttribute("rel"), "alternate", `${label}: sitemap alternate rel`);
          assert.equal(linksForLang[0].getAttribute("href"), href, `${label}: sitemap ${language} alternate target`);
        }
      }
    }
  } finally {
    dom.window.close();
  }
}

export function validateBlogImagePlan(articles, routes, images) {
  assert.equal(routes.length, articles.length, "Share manifest article inventory differs");
  assert.equal(images.length, articles.length * 2, "Share image inventory differs");
  for (const article of articles) {
    const paths = pathsFor(article);
    const matching = routes.filter((route) => route.pathRu === paths.ru);
    assert.equal(matching.length, 1, `${article.slug}: share manifest missing or duplicated`);
    const route = matching[0];
    assert.equal(route.pathEn, paths.en, `${article.slug}: share manifest English path`);
    assert.equal(route.ogSlug, article.ogSlug, `${article.slug}: share image identity`);
    assert.equal(route.datePublished, article.dateISO, `${article.slug}: share publication date`);
    assert.equal(route.dateModified, article.dateModified || article.dateISO, `${article.slug}: share modification date`);
    for (const lang of ["ru", "en"]) {
      const matches = images.filter((image) => image.routePath === paths[lang] && image.lang === lang);
      assert.equal(matches.length, 1, `${article.slug} [${lang}]: share image plan missing or duplicated`);
      const image = matches[0];
      assert.equal(image.imagePath, imageFor(article, lang), `${article.slug} [${lang}]: share-image target`);
      const title = lang === "ru" ? article.title : article.titleEn;
      const intro = lang === "ru" ? article.intro : article.introEn;
      const subtitle = intro.length > 90 ? `${intro.slice(0, 89).trimEnd()}…` : intro;
      assert.equal(image.title, title, `${article.slug} [${lang}]: share-image title language`);
      assert.equal(image.subtitle, subtitle, `${article.slug} [${lang}]: share-image subtitle language`);
    }
  }
}

export function validateBlogShareDocument(html, article, lang) {
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    const label = `${article.slug} [${lang}]`;
    const image = urlFor(imageFor(article, lang));
    const url = urlFor(pathsFor(article)[lang]);
    for (const [attr, key, expected] of [
      ["property", "og:url", url],
      ["property", "og:image", image],
      ["property", "og:image:secure_url", image],
      ["name", "twitter:image", image],
      ["property", "article:published_time", article.dateISO],
      ["property", "article:modified_time", article.dateModified || article.dateISO],
    ]) {
      const tags = doc.querySelectorAll(`meta[${attr}="${key}"]`);
      assert.equal(tags.length, 1, `${label}: missing/duplicate ${key}`);
      assert.equal(tags[0].getAttribute("content"), expected, `${label}: share ${key} target/date`);
    }
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((node) => {
        const data = JSON.parse(node.textContent);
        return Array.isArray(data) ? data : data["@graph"] || [data];
      }).filter((data) => data["@type"] === "Article");
    assert.ok(schemas.length, `${label}: missing share Article schema`);
    for (const schema of schemas) {
      assert.equal(schema.image?.url ?? schema.image, image, `${label}: share Article image target`);
    }
  } finally {
    dom.window.close();
  }
}

export async function validateGeneratedBlogDiscovery(articles, dist) {
  validateBlogSitemap(readFileSync(join(dist, "sitemap.xml"), "utf8"), articles);
  for (const article of articles) {
    for (const lang of ["ru", "en"]) {
      const imagePath = join(dist, imageFor(article, lang));
      const metadata = await sharp(imagePath).metadata();
      assert.deepEqual([metadata.format, metadata.width, metadata.height], ["jpeg", 1200, 630],
        `${article.slug} [${lang}]: generated OG image must be a 1200×630 JPEG`);
      const htmlPath = join(dist, pathsFor(article)[lang], "index.html");
      validateBlogShareDocument(readFileSync(htmlPath, "utf8"), article, lang);
    }
  }
}

// Expected routes come from the independent page-source reader, while routes
// and images are the actual manifest and generator plan (including deduping).
export function validateNonArticleImagePlan(expectedRoutes, routes, images) {
  for (const expected of expectedRoutes) {
    const label = expected.pathEn;
    const matches = routes.filter((r) => r.pathRu === expected.pathRu);
    assert.equal(matches.length, 1, `${label}: share manifest missing or duplicated`);
    const route = matches[0];
    assert.equal(route.pathEn, expected.pathEn, `${label}: share manifest English path`);
    assert.equal(route.ogSlug, expected.ogSlug, `${label}: share image identity`);
    for (const [lang, suffix] of [["ru", "Ru"], ["en", "En"]]) {
      const routePath = expected[`path${suffix}`];
      const plans = images.filter((i) => i.routePath === routePath);
      assert.equal(plans.length, 1, `${routePath}: share image plan missing or duplicated`);
      const image = plans[0];
      assert.equal(image.lang, lang, `${routePath}: share image plan language`);
      assert.equal(image.imagePath, imageFor(expected, lang), `${routePath}: share-image target`);
      assert.equal(images.filter((i) => i.imagePath === image.imagePath).length, 1,
        `${routePath}: share image filename collision`);
      assert.equal(image.title, expected[`h1${suffix}`], `${routePath}: share-image title language`);
      const intro = expected[`intro${suffix}`];
      const subtitle = intro.length > 90 ? `${intro.slice(0, 89).trimEnd()}…` : intro;
      assert.equal(image.subtitle, subtitle, `${routePath}: share-image subtitle language`);
    }
  }
}

export function validateNonArticleShareDocument(html, route, lang) {
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    const routePath = lang === "ru" ? route.pathRu : route.pathEn;
    const image = urlFor(imageFor(route, lang));
    for (const [attr, key, expected] of [
      ["property", "og:url", urlFor(routePath)],
      ["property", "og:type", "website"],
      ["property", "og:locale", lang === "ru" ? "ru_RU" : "en_US"],
      ["property", "og:image", image],
      ["property", "og:image:secure_url", image],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:image:type", "image/jpeg"],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:image", image],
    ]) {
      const tags = doc.head.querySelectorAll(`meta[${attr}="${key}"]`);
      assert.equal(tags.length, 1, `${routePath}: missing/duplicate ${key}`);
      assert.equal(tags[0].getAttribute("content"), expected, `${routePath}: share ${key} target`);
    }
  } finally {
    dom.window.close();
  }
}

export async function validateGeneratedNonArticleDiscovery(expectedRoutes, dist) {
  for (const route of expectedRoutes) {
    for (const lang of ["ru", "en"]) {
      const routePath = lang === "ru" ? route.pathRu : route.pathEn;
      const file = join(dist, imageFor(route, lang));
      let metadata;
      try {
        metadata = await sharp(file).metadata();
      } catch (cause) {
        throw new Error(`${routePath}: missing or invalid generated share image ${file}: ${cause.message}`, { cause });
      }
      assert.deepEqual([metadata.format, metadata.width, metadata.height], ["jpeg", 1200, 630],
        `${routePath}: generated OG image must be a 1200×630 JPEG`);
      validateNonArticleShareDocument(readFileSync(join(dist, routePath, "index.html"), "utf8"), route, lang);
    }
  }
}
