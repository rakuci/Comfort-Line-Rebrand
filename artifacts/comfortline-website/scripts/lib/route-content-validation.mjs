import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { SITE_URL } from "../route-manifest.mjs";

const normalize = (text) => (text ?? "").replace(/\s+/g, " ").trim();

// Parse only: jsdom does not run scripts or fetch resources here.
export function validateRenderedRouteDocument(html, route, lang) {
  const suffix = lang === "ru" ? "Ru" : "En";
  const context = `${route[`path${suffix}`]} [rendered ${lang}]`;
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    assert.equal(document.documentElement.lang, lang, `${context}: document language`);
    assert.equal(document.title, route[`title${suffix}`], `${context}: page title`);
    assert.equal(document.querySelector('head meta[name="description"]')?.content,
      route[`desc${suffix}`], `${context}: page description`);
    const canonical = document.querySelectorAll('head link[rel="canonical"]');
    assert.equal(canonical.length, 1, `${context}: exactly one canonical required`);
    assert.equal(canonical[0].href, new URL(route[`path${suffix}`], SITE_URL).href, `${context}: canonical target`);
    for (const target of ["ru", "en", "x-default"]) {
      const links = document.querySelectorAll(`head link[rel="alternate"][hreflang="${target}"]`);
      assert.equal(links.length, 1, `${context}: exactly one ${target} hreflang required`);
      assert.equal(links[0].href, new URL(target === "en" ? route.pathEn : route.pathRu, SITE_URL).href,
        `${context}: ${target} hreflang target`);
    }
    const root = document.querySelector("#root");
    assert(root, `${context}: missing SSR root`);
    const headings = root.querySelectorAll("h1");
    assert.equal(headings.length, 1, `${context}: exactly one route heading required`);
    // Display:block spans/line breaks can visually separate words without a
    // whitespace text node (the V-Class hero does this).
    assert.equal(normalize(headings[0].textContent).replace(/\s/g, ""), normalize(route[`h1${suffix}`]).replace(/\s/g, ""),
      `${context}: route-specific heading missing or wrong page rendered`);
    // These families expose their actual hero copy in the manifest. The
    // Europe overview ("other") instead has a separate SEO description.
    if (["service", "country", "vehicle"].includes(route.pageType)) {
      const intro = normalize(route[`intro${suffix}`]);
      assert(intro && normalize(root.textContent).includes(intro),
        `${context}: missing route-specific introductory content`);
    }
    // Real pages have multiple content sections beyond their hero. The old
    // summary contained only the intro and (at most) a single FAQ section.
    assert(root.querySelectorAll("h2").length >= 2,
      `${context}: missing complete SSR page sections (summary fallback is not sufficient)`);
  } finally {
    dom.window.close();
  }
}

export function renderRouteMarkup(SsrApp, routePath, render) {
  try {
    const markup = render(SsrApp, routePath);
    assert(typeof markup === "string" && markup.trim(), "empty SSR output");
    return markup;
  } catch (cause) {
    throw new Error(`[prerender] SSR render failed for "${routePath}": ${cause?.message ?? cause}`, { cause });
  }
}
