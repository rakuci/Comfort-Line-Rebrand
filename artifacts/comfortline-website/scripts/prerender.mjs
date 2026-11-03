import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer as createViteServer } from "vite";
import { JSDOM } from "jsdom";
import { collectAllRoutes, SITE_URL, DEFAULT_OG_IMAGE } from "./route-manifest.mjs";
import { createDataLoader } from "./lib/load-blog-data.mjs";
import { validateRenderedBlogPages } from "./lib/blog-content-validation.mjs";
import { renderRouteMarkup, validateRenderedRouteDocument } from "./lib/route-content-validation.mjs";
import { collectNonArticleShareExpectations } from "./lib/non-article-share-expectations.mjs";
import { validateGeneratedNonArticleDiscovery } from "./lib/blog-discovery-validation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "public");

// ============================================================================
// SSR bootstrap — jsdom globals + a Vite SSR module loader for src/ssr-entry.tsx
//
// React's renderToStaticMarkup is synchronous and cannot suspend on a lazy()
// import, so it renders actual (eagerly-imported) route components via
// src/ssr-entry.tsx. A handful of components reference `document`/`window`
// unconditionally during render (e.g. ReactDOM.createPortal(..., document.body)
// in modals that are closed by default), so jsdom stubs are installed globally
// before the SSR module graph is loaded.
// ============================================================================

function installJsdomGlobals() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: SITE_URL + "/" });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  // Explicit signal (not tied to typeof window/document) that lets components
  // opt out of browser-only behavior (e.g. createPortal, which React's
  // synchronous SSR renderer rejects outright) during this build-time pass.
  global.__SSR_PRERENDER__ = true;
  Object.defineProperty(global, "navigator", {
    value: window.navigator,
    configurable: true,
    writable: true,
  });
  global.HTMLElement = window.HTMLElement;
  global.customElements = window.customElements;
  global.CustomEvent = window.CustomEvent;
  global.Node = window.Node;
  global.getComputedStyle = window.getComputedStyle;
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }));
  global.matchMedia = window.matchMedia;
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = window.IntersectionObserver || NoopObserver;
  global.ResizeObserver = window.ResizeObserver || NoopObserver;
  window.scrollTo = window.scrollTo || (() => {});
  return dom;
}

async function createSsrModuleLoader() {
  const vite = await createViteServer({
    root: ROOT,
    configFile: path.join(ROOT, "vite.config.ts"),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "warn",
  });
  try {
    const { SsrApp } = await vite.ssrLoadModule("/src/ssr-entry.tsx");
    return { vite, SsrApp };
  } catch (error) {
    await vite.close();
    throw error;
  }
}

const renderPage = (SsrApp, routePath) => {
  let seo;
  const markup = renderRouteMarkup(SsrApp, routePath, (App, path) =>
    renderToStaticMarkup(createElement(App, { path, onSeo: (data) => {
      if (seo) throw new Error(`Multiple SEO owners for "${routePath}"`);
      seo = data;
    } })));
  if (!seo) throw new Error(`[prerender] Missing SEO owner for "${routePath}"`);
  return { markup, seo };
};

// ============================================================================
// HTML generation
// ============================================================================

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(template, route, lang, page, dist = DIST) {
  const isRu = lang === "ru";
  const title = isRu ? route.titleRu : route.titleEn;
  const desc = isRu ? route.descRu : route.descEn;
  const localPath = isRu ? route.pathRu : route.pathEn;
  const canonicalUrl = SITE_URL + encodeURI(localPath);
  const ogLocale = isRu ? "ru_RU" : "en_US";
  const ogLocaleAlt = isRu ? "en_US" : "ru_RU";
  // og-images.mjs generates a locale-specific /og/<ogSlug>-<lang>.jpg for
  // every route in this same manifest, so English pages get an
  // English-language preview image instead of sharing the Russian one. We
  // still verify the file landed on disk before pointing social metadata at
  // it — any route-specific file that failed to generate falls back to the
  // stable, always-present site-wide opengraph.jpg instead of a broken image URL.
  const ogImage =
    route.ogSlug && fs.existsSync(path.join(dist, "og", `${route.ogSlug}-${lang}.jpg`))
      ? `${SITE_URL}/og/${route.ogSlug}-${lang}.jpg`
      : DEFAULT_OG_IMAGE;
  const ogType = route.isArticle ? "article" : "website";

  let html = template;

  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );

  // Real per-route destination (from route-manifest.mjs, sourced from the
  // page's own fromName/toName data) rather than guessing from the URL —
  // only known geo coordinates get a destGeo override; everything else
  // keeps the site-wide Minsk default already baked into the HTML template.
  const toName = isRu ? route.toNameRu : route.toNameEn;
  const KNOWN_GEO = {
    warsaw: { region: "PL-MZ", placename: "Warsaw", pos: "52.2297;21.0122" },
    варшава: { region: "PL-MZ", placename: "Warsaw", pos: "52.2297;21.0122" },
    vilnius: { region: "LT-VL", placename: "Vilnius", pos: "54.6872;25.2797" },
    вильнюс: { region: "LT-VL", placename: "Vilnius", pos: "54.6872;25.2797" },
    kaunas: { region: "LT-KU", placename: "Kaunas", pos: "54.8985;23.9036" },
    каунас: { region: "LT-KU", placename: "Kaunas", pos: "54.8985;23.9036" },
    riga: { region: "LV-RIX", placename: "Riga", pos: "56.9496;24.1052" },
    рига: { region: "LV-RIX", placename: "Riga", pos: "56.9496;24.1052" },
    berlin: { region: "DE-BE", placename: "Berlin", pos: "52.5200;13.4050" },
    берлин: { region: "DE-BE", placename: "Berlin", pos: "52.5200;13.4050" },
  };
  const destGeo =
    route.pageType === "service" && toName
      ? Object.entries(KNOWN_GEO).find(([key]) => toName.toLowerCase().includes(key))?.[1] || null
      : null;
  if (destGeo) {
    html = html.replace(
      /<meta name="geo\.region" content="[^"]*"\s*\/>/,
      `<meta name="geo.region" content="${destGeo.region}" />\n    <meta name="geo.region" content="BY-MI" />`,
    );
    html = html.replace(
      /<meta name="geo\.placename" content="[^"]*"\s*\/>/,
      `<meta name="geo.placename" content="Minsk – ${destGeo.placename}" />`,
    );
    html = html.replace(
      /<meta name="geo\.position" content="[^"]*"\s*\/>/,
      `<meta name="geo.position" content="${destGeo.pos}" />`,
    );
  }

  html = html.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${ogLocale}" />`,
  );
  html = html.replace(
    /<meta property="og:locale:alternate" content="[^"]*"\s*\/>/,
    `<meta property="og:locale:alternate" content="${ogLocaleAlt}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="${ogType}" />`,
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${ogImage}" />`,
  );
  html = html.replace(
    /<meta property="og:image:secure_url" content="[^"]*"\s*\/>/,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(desc)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${ogImage}" />`,
  );

  const hreflang = `
    <link rel="alternate" hreflang="ru" href="${SITE_URL + encodeURI(route.pathRu)}" />
    <link rel="alternate" hreflang="en" href="${SITE_URL + encodeURI(route.pathEn)}" />
    <link rel="alternate" hreflang="x-default" href="${SITE_URL + encodeURI(route.pathRu)}" />`;
  html = html.replace(
    /<!-- hreflang alternates are injected[^>]*-->/,
    hreflang,
  );

  if (route.isArticle) {
    const schemas = Array.isArray(page.seo.jsonLd) ? page.seo.jsonLd : [page.seo.jsonLd];
    const articleSchema = schemas.find((schema) => schema?.["@type"] === "Article");
    const articleMetaInjection = `
    <meta name="keywords" content="${escapeHtml(route.keywords)}" />
    <meta property="article:published_time" content="${route.datePublished}" />
    <meta property="article:modified_time" content="${route.dateModified}" />
    <meta property="article:author" content="${escapeHtml(articleSchema.author.name)}" />
    <meta property="article:publisher" content="${SITE_URL}" />
    <meta property="article:section" content="${escapeHtml(isRu ? route.section : route.sectionEn || route.section)}" />
    ${route.keywords.split(",").map((k) => `<meta property="article:tag" content="${escapeHtml(k.trim())}" />`).join("\n    ")}`;
    html = html.replace(`<meta property="og:type" content="${ogType}" />`, `<meta property="og:type" content="${ogType}" />${articleMetaInjection}`);
  }
  // All route data comes from the page's real Seo/useSeo render. Only tagged
  // scripts are replaced by the client; untagged shell identity stays intact.
  const schemas = page.seo.jsonLd
    ? (Array.isArray(page.seo.jsonLd) ? page.seo.jsonLd : [page.seo.jsonLd])
    : [];
  const extraJsonLd = schemas.map((schema) =>
    `\n    <script type="application/ld+json" data-seo="1">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`
  ).join("");
  html = html.replace("</head>", `${extraJsonLd}\n  </head>`);

  // Only actual route component output can enter the production document.
  html = html.replace('<div id="root"></div>', () => `<div id="root">${page.markup}</div>`);

  return html;
}

function emit(routePath, html, dist = DIST) {
  const [pathname] = routePath.split("?");
  const folderRel = decodeURIComponent(pathname).replace(/^\//, "");
  const folder = path.join(dist, folderRel);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "index.html"), html, "utf8");
  return path.relative(dist, path.join(folder, "index.html"));
}

// Injectable loader/output directory keep failure tests isolated and offline;
// the CLI always uses the real Vite SSR entry and production output directory.
export async function prerender({ dist = DIST, loadSsrModule = createSsrModuleLoader } = {}) {
  const templatePath = path.join(dist, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`[prerender] template not found: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, "utf8");
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("The HTML template is already prerendered or has no empty #root. Run a fresh Vite build before prerendering; reusing homepage output would copy its metadata/content into other routes.");
  }

  const { allRoutes, manualRoutes, autoRoutes, vehicleRoutes, blogArticleRoutes } = collectAllRoutes();

  const dom = installJsdomGlobals();
  let vite;
  const written = [];
  const checkedRoutes = new Set([...autoRoutes, ...vehicleRoutes]);
  try {
    const loader = await loadSsrModule();
    vite = loader.vite;
    for (const route of allRoutes) {
      for (const lang of ["ru", "en"]) {
        const routePath = lang === "ru" ? route.pathRu : route.pathEn;
        const page = renderPage(loader.SsrApp, routePath);
        const html = buildHtml(template, route, lang, page, dist);
        if (checkedRoutes.has(route)) validateRenderedRouteDocument(html, route, lang);
        written.push(emit(routePath, html, dist));
      }
    }
  } finally {
    await vite?.close();
    dom.window.close();
  }
  console.log(`[prerender] offline route regression checks passed for ${checkedRoutes.size * 2} localized pages.`);

  // Never send a blog summary fallback, stale metadata, or lost translated
  // content on to IndexNow/publishing as though prerendering had succeeded.
  const { ARTICLES } = createDataLoader()("blog-articles");
  const validatedBlogPages = validateRenderedBlogPages(ARTICLES, dist);
  console.log(`[prerender] offline blog regression checks passed for ${validatedBlogPages} localized pages.`);
  const shareRoutes = collectNonArticleShareExpectations();
  await validateGeneratedNonArticleDiscovery(shareRoutes, dist);
  console.log(`[prerender] offline share-image checks passed for ${shareRoutes.length * 2} transfer/fleet/blog-index pages.`);

  console.log(
    `[prerender] wrote ${written.length} files for ${allRoutes.length} routes (${manualRoutes.length} manual, ${autoRoutes.length} auto, ${vehicleRoutes.length} vehicle, ${1 + blogArticleRoutes.length} blog):`,
  );
  for (const f of written) console.log(`  - ${f}`);
  console.log(`[prerender] all ${written.length} pages were rendered via real SSR (src/ssr-entry.tsx).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  prerender().catch((err) => {
    console.error("[prerender] fatal error:", err);
    process.exit(1);
  });
}
