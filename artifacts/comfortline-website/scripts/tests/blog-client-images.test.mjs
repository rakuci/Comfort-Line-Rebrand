import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test, { after } from "node:test";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { renderToString } from "react-dom/server";
import { collectAllRoutes, SITE_URL } from "../route-manifest.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const dist = path.join(root, "dist/public");
const dom = new JSDOM("<!doctype html><html><head></head><body><div id='root'></div></body></html>", {
  url: SITE_URL,
});
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.location = dom.window.location;
global.history = dom.window.history;
global.Event = dom.window.Event;
for (const method of ["addEventListener", "removeEventListener", "dispatchEvent"]) {
  global[method] = dom.window[method].bind(dom.window);
}
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.IS_REACT_ACT_ENVIRONMENT = true;

// Load browser-aware routing only after installing the DOM. Exercise the real
// pages, LanguageProvider, Seo and useSeo effects, without unrelated layout,
// animations, booking modals or live border widgets.
const wouter = await import("wouter");
const { hydrateRoot } = await import("react-dom/client");
const require = createRequire(import.meta.url);
const cache = new Map();
const noop = () => null;
const layout = new Proxy({ default: noop }, { get: () => noop });
const motion = new Proxy({}, {
  get: (_, tag) => ({ initial, whileInView, viewport, transition, children, ...props }) =>
    React.createElement(tag, props, children),
});
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  function resolve(specifier) {
    if (specifier === "wouter") return wouter;
    if (specifier === "framer-motion") return { motion, AnimatePresence: React.Fragment };
    if (specifier.startsWith("@/components/") || specifier === "@/pages/not-found") return layout;
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const base = specifier.startsWith("@/")
        ? path.join(root, "src", specifier.slice(2))
        : path.resolve(path.dirname(file), specifier);
      if (base.endsWith(".json")) return require(base);
      const target = [base + ".ts", base + ".tsx"].find(existsSync);
      assert.ok(target, `Cannot resolve ${specifier} from ${file}`);
      return load(target);
    }
    return require(specifier);
  }
  new Function("require", "module", "exports", code)(resolve, module, module.exports);
  return module.exports;
}
const { LanguageProvider } = load(path.join(root, "src/context/language-context.tsx"));
const BlogIndex = load(path.join(root, "src/pages/blog/index.tsx")).default;
const BlogArticle = load(path.join(root, "src/pages/blog/article.tsx")).default;
const { ARTICLES } = load(path.join(root, "src/data/blog-articles.ts"));
const { allRoutes } = collectAllRoutes();
const routes = allRoutes.filter((route) => route.isArticle || route.ogSlug === "blog-index");
assert.ok(routes.length > 1, "Expected blog index and article routes");
const pageCases = [
  ["/minsk-vilnius-airport", "minsk-vilnius-airport"],
  ["/minsk-warsaw-airport", "minsk-warsaw-airport"],
  ["/lithuania-transfer", "lithuania-transfer"],
  ["/group-transfer", "group-transfer"],
  ["/en/faq", "faq"],
  ["/en", "landing"],
  ["/en/terms", "terms"],
  ["/en/privacy", "privacy-policy"],
].map(([pathEn, file]) => ({
  route: allRoutes.find((route) => route.pathEn === pathEn),
  component: load(path.join(root, `src/pages/${file}.tsx`)).default,
}));
const { VehiclePage } = load(path.join(root, "src/pages/vehicle-page.tsx"));
pageCases.push({
  route: allRoutes.find((route) => route.pathEn === "/mercedes-e-class-transfer"),
  component: () => React.createElement(VehiclePage, { slug: "mercedes-e-class" }),
});
assert.ok(pageCases.every(({ route }) => route), "Expected every schema regression route in the manifest");
let navigate;
function App() {
  [, navigate] = wouter.useLocation();
  return React.createElement(LanguageProvider, null,
    React.createElement(wouter.Switch, null,
      ...pageCases.flatMap(({ route, component }) => [route.pathRu, route.pathEn].map((path) =>
        React.createElement(wouter.Route, { key: path, path, component }))),
      React.createElement(wouter.Route, { path: "/blog", component: BlogIndex }),
      React.createElement(wouter.Route, { path: "/блог", component: BlogIndex }),
      React.createElement(wouter.Route, { path: "/blog/:slug", component: BlogArticle }),
      React.createElement(wouter.Route, { path: "/блог/:slug", component: BlogArticle }),
    ));
}

const schemaSelector = 'script[type="application/ld+json"]';
const routeSchemaSelector = `${schemaSelector}[data-seo]`;
const readSchemas = (head, selector) => [...head.querySelectorAll(selector)]
  .map((el) => JSON.parse(el.textContent));
const schemaTypes = (schema) => Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
function assertUniqueSchemaOwners(head, label) {
  const schemas = readSchemas(head, schemaSelector);
  const definitions = new Set();
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach(visit);
    // Repeated @id-only references are legitimate; repeated definitions aren't.
    if (value["@id"] && Object.keys(value).some((key) => !["@id", "@context"].includes(key))) {
      assert.ok(!definitions.has(value["@id"]), `${label}: duplicate entity ${value["@id"]}`);
      definitions.add(value["@id"]);
    }
    Object.values(value).forEach(visit);
  }
  schemas.forEach(visit);
  const businesses = schemas.filter((schema) => schemaTypes(schema).includes("LocalBusiness"));
  assert.equal(businesses.length, 1, `${label}: exactly one persistent business`);
  assert.equal(businesses[0]["@id"], `${SITE_URL}#business`);
  for (const schema of readSchemas(head, routeSchemaSelector)) {
    assert.notEqual(schema["@id"], `${SITE_URL}#business`, `${label}: business must not be route-owned`);
    assert.ok(!schemaTypes(schema).some((type) => ["LocalBusiness", "Organization", "WebSite"].includes(type)),
      `${label}: site identity must not be route-owned`);
  }
}
const expectedHeads = new Map();
function expectedHead(route, lang) {
  const routePath = route[lang === "ru" ? "pathRu" : "pathEn"];
  if (!expectedHeads.has(routePath)) {
    const staticDom = new JSDOM(readFileSync(path.join(dist, routePath.slice(1), "index.html"), "utf8"));
    const head = staticDom.window.document.head;
    assertUniqueSchemaOwners(head, `${routePath} [static ${lang}]`);
    const unowned = readSchemas(head, `${schemaSelector}:not([data-seo])`);
    // Untagged schemas belong only to the shell, never to an initial route.
    for (const schema of unowned) {
      const types = schemaTypes(schema);
      assert.ok(types.some((type) => ["WebSite", "Organization", "LocalBusiness"].includes(type)),
        `${routePath}: unowned route schema ${types}`);
    }
    expectedHeads.set(routePath, {
      route: readSchemas(head, routeSchemaSelector),
      site: unowned,
    });
    staticDom.window.close();
  }
  return expectedHeads.get(routePath);
}

function assertSchemas(route, lang) {
  const expected = expectedHead(route, lang);
  assertUniqueSchemaOwners(document.head, `${route.pathEn} [client ${lang}]`);
  assert.deepEqual(readSchemas(document.head, routeSchemaSelector), expected.route,
    `${route.pathEn} [${lang}]: static and client route schemas must match exactly`);
  assert.deepEqual(readSchemas(document.head, `${schemaSelector}:not([data-seo])`), expected.site,
    "Hydration/navigation must preserve shell identity");
  for (const type of ["Article", "BreadcrumbList", "FAQPage", "Service", "TaxiService"]) {
    const schemas = readSchemas(document.head, routeSchemaSelector).filter((schema) => schemaTypes(schema).includes(type));
    assert.ok(schemas.length <= 1, `${route.pathEn}: duplicate ${type}`);
  }
  const article = expected.route.find((schema) => schema["@type"] === "Article");
  if (article) {
    const source = ARTICLES.find((entry) => entry.ogSlug === route.ogSlug);
    assert.ok(source, "Article must have an independent content source");
    assert.equal(article.author.name, source.dateModified ? "ComfortLine Editorial Team" : "ComfortLine");
  }
}

function assertImages(route, lang) {
  const image = `${SITE_URL}/og/${route.ogSlug}-${lang}.jpg`;
  assert.ok(existsSync(path.join(dist, "og", `${route.ogSlug}-${lang}.jpg`)), `Missing generated asset: ${image}`);
  for (const selector of [
    'meta[property="og:image"]',
    'meta[property="og:image:secure_url"]',
    'meta[name="twitter:image"]',
  ]) {
    const tags = [...document.head.querySelectorAll(selector)];
    assert.equal(tags.length, 1, `Expected exactly one ${selector}`);
    assert.equal(tags[0].content, image, `${route.ogSlug} (${lang}): ${selector}`);
  }
  const articles = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
    .map((el) => JSON.parse(el.textContent))
    .filter((schema) => schema["@type"] === "Article");
  assert.equal(articles.length, route.isArticle ? 1 : 0);
  for (const article of articles) {
    assert.equal(typeof article.image === "string" ? article.image : article.image.url, image);
    assert.equal(article.inLanguage, lang);
  }
  assert.equal(document.documentElement.lang, lang);
}

async function directLoad(route, lang) {
  const routePath = route[lang === "ru" ? "pathRu" : "pathEn"];
  dom.reconfigure({ url: SITE_URL + encodeURI(routePath) });
  const html = readFileSync(path.join(dist, routePath.slice(1), "index.html"), "utf8");
  const prerendered = new JSDOM(html);
  document.head.innerHTML = prerendered.window.document.head.innerHTML;
  document.documentElement.lang = prerendered.window.document.documentElement.lang;
  prerendered.window.close();
  assertSchemas(route, lang);
  if (routes.includes(route)) assertImages(route, lang);
  const container = document.getElementById("root");
  container.innerHTML = renderToString(React.createElement(App));
  let client;
  await act(async () => {
    client = hydrateRoot(container, React.createElement(App));
  });
  assertSchemas(route, lang);
  if (routes.includes(route)) assertImages(route, lang);
  return client;
}

test("direct loads and hydration preserve every blog's generated locale image", async () => {
  for (const route of routes) for (const lang of ["ru", "en"]) {
    const client = await directLoad(route, lang);
    await act(async () => client.unmount());
  }
});

test("service, country, fleet, FAQ and utility schemas survive hydration without duplication", async () => {
  // Check every generated document's ownership, not just the mounted examples.
  for (const route of allRoutes) for (const lang of ["ru", "en"]) expectedHead(route, lang);
  for (const { route } of pageCases) for (const lang of ["ru", "en"]) {
    const client = await directLoad(route, lang);
    await act(async () => client.unmount());
    assert.equal(document.head.querySelectorAll(routeSchemaSelector).length, 0,
      "Unmount must remove all route-owned schemas");
  }
});

test("an airport entry document leaves no stale service, FAQ or breadcrumbs after navigation", async () => {
  const client = await directLoad(pageCases[0].route, "en");
  try {
    const sequence = [
      pageCases[1].route, pageCases[2].route, pageCases.at(-1).route,
      routes.find((route) => route.isArticle), routes.find((route) => route.ogSlug === "blog-index"),
      ...pageCases.slice(3, -1).map(({ route }) => route), pageCases[0].route,
    ];
    for (const route of sequence) for (const lang of ["ru", "en"]) {
      await act(async () => navigate(route[lang === "ru" ? "pathRu" : "pathEn"]));
      assertSchemas(route, lang);
    }
    const country = pageCases[2].route;
    await act(async () => navigate(country.pathEn));
    const breadcrumb = readSchemas(document.head, routeSchemaSelector)
      .find((schema) => schema["@type"] === "BreadcrumbList");
    assert.equal(breadcrumb.itemListElement.length, 3, "Country hierarchy must retain Home → Europe → destination");
  } finally {
    await act(async () => client.unmount());
  }
});

test("client article navigation and RU/EN switching update all image metadata", async () => {
  const index = routes.find((route) => route.ogSlug === "blog-index");
  const client = await directLoad(index, "ru");
  try {
    // Keep the React root mounted: catches stale images between articles and
    // after switching languages in both directions, including back to the index.
    for (const route of routes) for (const lang of ["en", "ru"]) {
      await act(async () => navigate(route[lang === "ru" ? "pathRu" : "pathEn"]));
      assertImages(route, lang);
      assertSchemas(route, lang);
    }
    await act(async () => navigate(index.pathEn));
    assertImages(index, "en");
  } finally {
    await act(async () => client.unmount());
  }
});

after(() => dom.window.close());
