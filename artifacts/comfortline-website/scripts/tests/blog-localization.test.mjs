import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { collectAllRoutes } from "../route-manifest.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const cache = new Map();
let lang = "en";
let slug;
const noop = () => null;
const layout = new Proxy({ default: noop }, { get: () => noop });
const motion = new Proxy({}, {
  get: (_, tag) => ({ initial, whileInView, viewport, transition, children, ...props }) =>
    React.createElement(tag, props, children),
});

// Render the real pages and article data, excluding unrelated layout, SEO
// effects and interactive widgets. Both language branches are exercised.
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
    if (specifier === "wouter") return {
      useRoute: (pattern) => {
        const matches = pattern.startsWith(lang === "ru" ? "/блог/" : "/blog/");
        return matches ? [true, { slug }] : [false, null];
      },
    };
    if (specifier === "@/context/language-context") return { useLang: () => ({ lang }) };
    if (specifier === "framer-motion") return { motion };
    if (specifier.startsWith("@/components/") || specifier === "@/pages/not-found" || specifier === "@/seo/Seo") return layout;
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const base = specifier.startsWith("@/")
        ? path.join(root, "src", specifier.slice(2))
        : path.resolve(path.dirname(file), specifier);
      const target = [base + ".ts", base + ".tsx"].find(existsSync);
      assert.ok(target, `Cannot resolve ${specifier}`);
      return load(target);
    }
    return require(specifier);
  }
  new Function("require", "module", "exports", code)(resolve, module, module.exports);
  return module.exports;
}

const { ARTICLES } = load(path.join(root, "src/data/blog-articles.ts"));
const BlogIndex = load(path.join(root, "src/pages/blog/index.tsx")).default;
const BlogArticle = load(path.join(root, "src/pages/blog/article.tsx")).default;
const { allRoutes } = collectAllRoutes();

function renderedDocument(Component) {
  return new JSDOM(renderToStaticMarkup(React.createElement(Component)));
}

test("blog cards render localized categories in both languages", () => {
  for (lang of ["en", "ru"]) {
    const dom = renderedDocument(BlogIndex);
    try {
      const cards = [...dom.window.document.querySelectorAll('a[href^="/blog/"], a[href^="/%D0"], a[href^="/блог/"]')];
      assert.equal(cards.length, ARTICLES.length);
      cards.forEach((card, i) => {
        const article = ARTICLES[i];
        assert.equal(card.querySelector("span").textContent,
          lang === "ru" ? article.category : (article.categoryEn ?? article.category));
      });
    } finally {
      dom.window.close();
    }
  }
});

test("English categories fall back when a translation is absent", () => {
  lang = "en";
  const article = ARTICLES[0];
  const original = article.categoryEn;
  let dom;
  try {
    delete article.categoryEn;
    dom = renderedDocument(BlogIndex);
    assert.equal(dom.window.document.querySelector('a[href^="/blog/"] span').textContent, article.category);
  } finally {
    article.categoryEn = original;
    dom?.window.close();
  }
});

test("every article booking CTA uses its matching locale service route and label", () => {
  const articles = ARTICLES.filter((article) => article.ctaRoute);
  assert.ok(articles.length > 0);
  for (const article of articles) {
    const cta = article.ctaRoute;
    const destination = allRoutes.find((route) => route.pathRu === cta.path);
    assert.ok(destination, `${article.slug}: Russian service route exists`);
    assert.equal(cta.pathEn, destination.pathEn, `${article.slug}: paired English destination`);
    for (lang of ["en", "ru"]) {
      slug = lang === "ru" ? article.slug : article.slugEn;
      const dom = renderedDocument(BlogArticle);
      try {
        const label = lang === "ru" ? cta.label : (cta.labelEn ?? cta.label);
        const link = [...dom.window.document.querySelectorAll("a")].find((a) => a.textContent.trim() === label);
        assert.ok(link, `${slug}: booking CTA renders`);
        assert.equal(link.getAttribute("href"), lang === "ru" ? cta.path : destination.pathEn, slug);
      } finally {
        dom.window.close();
      }
    }
  }
});
