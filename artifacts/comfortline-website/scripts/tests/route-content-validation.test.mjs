import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { collectAllRoutes, SITE_URL } from "../route-manifest.mjs";
import { renderRouteMarkup, validateRenderedRouteDocument } from "../lib/route-content-validation.mjs";

const { autoRoutes, vehicleRoutes } = collectAllRoutes();
const representatives = [
  autoRoutes.find((r) => r.pathEn === "/minsk-city-transfer"),
  autoRoutes.find((r) => r.pathEn === "/minsk-vilnius-airport"),
  autoRoutes.find((r) => r.pageType === "country"),
  vehicleRoutes[0],
  autoRoutes.find((r) => r.pathEn === "/europe-transfer"),
];
assert(representatives.every(Boolean), "all protected route families must be in the manifest");
const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function fixture(route, lang) {
  const suffix = lang === "ru" ? "Ru" : "En";
  const url = (p) => new URL(p, SITE_URL).href;
  return `<!doctype html><html lang="${lang}"><head>
    <title>${escape(route[`title${suffix}`])}</title>
    <meta name="description" content="${escape(route[`desc${suffix}`])}">
    <link rel="canonical" href="${url(route[`path${suffix}`])}">
    <link rel="alternate" hreflang="ru" href="${url(route.pathRu)}">
    <link rel="alternate" hreflang="en" href="${url(route.pathEn)}">
    <link rel="alternate" hreflang="x-default" href="${url(route.pathRu)}">
    </head><body><div id="root"><h1>${escape(route[`h1${suffix}`])}</h1>
    <p>${escape(route[`intro${suffix}`])}</p><section><h2>Details</h2><p>Details</p></section>
    <section><h2>Options</h2><p>Options</p></section></div></body></html>`;
}

for (const route of representatives) for (const lang of ["ru", "en"]) {
  const suffix = lang === "ru" ? "Ru" : "En";
  const routePath = route[`path${suffix}`];
  const html = fixture(route, lang);
  test(`${routePath}: localized content and metadata pass`, () => {
    validateRenderedRouteDocument(html, route, lang);
  });
  for (const [name, mutate, message] of [
    ["empty root", (s) => s.replace(/<div id="root">[\s\S]*<\/div>/, '<div id="root"></div>'), /route heading/],
    ["old summary", (s) => s.replace(/<section>[\s\S]*<\/section>/, "<section><h2>FAQ</h2><p>Answer</p></section>"), /summary fallback/],
    ["wrong route", (s) => s.replace(/<h1>.*?<\/h1>/, "<h1>Not found</h1>"), /wrong page rendered/],
    ...(["service", "country", "vehicle"].includes(route.pageType) ? [
      ["lost intro", (s) => s.replace(/<p>.*?<\/p>/, "<p>Generic summary</p>"), /introductory content/],
    ] : []),
    ["wrong title", (s) => s.replace(/<title>.*?<\/title>/, "<title>Home</title>"), /page title/],
    ["wrong description", (s) => s.replace(/name="description" content="[^"]*"/, 'name="description" content="Home"'), /page description/],
    ["wrong canonical", (s) => s.replace(/rel="canonical" href="[^"]*"/, `rel="canonical" href="${SITE_URL}/"`), /canonical target/],
    ["wrong language", (s) => s.replace(`lang="${lang}"`, 'lang="fr"'), /document language/],
    ["missing alternate", (s) => s.replace(/<link rel="alternate" hreflang="en"[^>]*>/, ""), /en hreflang/],
  ]) {
    test(`${routePath}: ${name} fails with path`, () => {
      assert.throws(() => validateRenderedRouteDocument(mutate(html), route, lang),
        (error) => error.message.includes(routePath) && message.test(error.message));
    });
  }
  test(`${routePath}: render failure retains original cause`, () => {
    const cause = new Error("deliberately broken component");
    assert.throws(() => renderRouteMarkup(null, routePath, () => { throw cause; }),
      (error) => error.cause === cause && error.message.includes(routePath) && error.message.includes(cause.message));
  });
  test(`${routePath}: empty SSR is fatal`, () => {
    for (const empty of ["", " ", null, undefined]) {
      assert.throws(() => renderRouteMarkup(null, routePath, () => empty), /empty SSR output/);
    }
  });
}

// Exercise the production orchestration in a subprocess, with no Vite server,
// network, browser, source edits, or writes to the real dist directory.
for (const lang of ["ru", "en"]) {
  test(`production rendering exits nonzero for a deliberately failing ${lang} non-blog route`, () => {
    const dist = mkdtempSync(path.join(tmpdir(), "route-prerender-"));
    const target = autoRoutes[0][lang === "ru" ? "pathRu" : "pathEn"];
    const template = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    writeFileSync(path.join(dist, "index.html"), template);
    try {
      const result = spawnSync(process.execPath, ["--input-type=module", "-e", `
        import { createElement as h } from "react";
        import { writeFileSync } from "node:fs";
        import { prerender } from ${JSON.stringify(new URL("../prerender.mjs", import.meta.url).href)};
        import { collectAllRoutes } from ${JSON.stringify(new URL("../route-manifest.mjs", import.meta.url).href)};
        const routes = collectAllRoutes().allRoutes;
        function SsrApp({ path }) {
          if (path === ${JSON.stringify(target)}) throw new Error("injected component failure");
          const route = routes.find(r => r.pathRu === path || r.pathEn === path);
          return h("main", null, h("h1", null, route[path === route.pathRu ? "h1Ru" : "h1En"]),
            h("p", null, route[path === route.pathRu ? "introRu" : "introEn"]),
            h("h2", null, "Details"), h("h2", null, "Options"));
        }
        await prerender({
          dist: ${JSON.stringify(dist)},
          loadSsrModule: async () => ({ SsrApp, vite: { close: async () =>
            writeFileSync(${JSON.stringify(path.join(dist, "closed"))}, "closed") } }),
        });
      `], { cwd: new URL("../../", import.meta.url), encoding: "utf8", timeout: 30000 });
      assert.equal(result.error, undefined);
      assert.notEqual(result.status, 0, "a broken non-blog component must stop production rendering");
      assert(result.stderr.includes(target), result.stderr);
      assert(result.stderr.includes("injected component failure"), result.stderr);
      assert(existsSync(path.join(dist, "closed")), "SSR loader must close on failure");
      assert(!existsSync(path.join(dist, target.slice(1), "index.html")), "failed route must not emit a summary");
      assert(!result.stdout.includes("offline blog regression checks passed"), "publishing checks must not continue");
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
}
