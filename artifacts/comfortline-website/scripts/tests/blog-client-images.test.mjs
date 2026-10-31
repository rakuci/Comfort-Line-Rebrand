import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
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
    if (specifier === "framer-motion") return { motion };
    if (specifier.startsWith("@/components/") || specifier === "@/pages/not-found") return layout;
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const base = specifier.startsWith("@/")
        ? path.join(root, "src", specifier.slice(2))
        : path.resolve(path.dirname(file), specifier);
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
const { allRoutes } = collectAllRoutes();
const routes = allRoutes.filter((route) => route.isArticle || route.ogSlug === "blog-index");
assert.ok(routes.length > 1, "Expected blog index and article routes");
let navigate;
function App() {
  [, navigate] = wouter.useLocation();
  return React.createElement(LanguageProvider, null,
    React.createElement(wouter.Switch, null,
      React.createElement(wouter.Route, { path: "/blog", component: BlogIndex }),
      React.createElement(wouter.Route, { path: "/блог", component: BlogIndex }),
      React.createElement(wouter.Route, { path: "/blog/:slug", component: BlogArticle }),
      React.createElement(wouter.Route, { path: "/блог/:slug", component: BlogArticle }),
    ));
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
  assertImages(route, lang);
  const container = document.getElementById("root");
  container.innerHTML = renderToString(React.createElement(App));
  let client;
  await act(async () => {
    client = hydrateRoot(container, React.createElement(App));
  });
  assertImages(route, lang);
  return client;
}

test("direct loads and hydration preserve every blog's generated locale image", async () => {
  for (const route of routes) for (const lang of ["ru", "en"]) {
    const client = await directLoad(route, lang);
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
    }
    await act(async () => navigate(index.pathEn));
    assertImages(index, "en");
  } finally {
    await act(async () => client.unmount());
    dom.window.close();
  }
});
