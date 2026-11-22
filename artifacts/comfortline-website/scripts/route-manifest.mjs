import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "src", "pages");
export const SITE_URL = "https://comfortline.by";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

// ============================================================================
// Generic source-extraction helpers.
//
// Route metadata (titles, descriptions, H1s, intros) lives inline in the page
// components and in src/data/blog-articles.ts. Rather than hand-copy it into
// this script (which drifts out of sync — see the EN/RU blog bug this file
// used to have), we parse it directly out of the source files at build time.
//
// This module is the single source of truth for the site's route manifest
// (used by both scripts/prerender.mjs for HTML/meta generation and
// scripts/og-images.mjs for social preview images) so a new page can never
// ship with SEO metadata in one place and a missing/broken OG image in the
// other.
// ============================================================================

function extractObjectLiteral(src, markerRegex) {
  const m = markerRegex.exec(src);
  if (!m) return null;
  const searchFrom = m.index + m[0].length;
  const braceStart = src.indexOf("{", searchFrom);
  if (braceStart === -1) return null;
  let depth = 0;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(braceStart, i + 1);
    }
  }
  return null;
}

/** Like extractObjectLiteral but for a `[...]` array literal following the marker. */
function extractArrayLiteral(src, markerRegex) {
  const m = markerRegex.exec(src);
  if (!m) return null;
  const searchFrom = m.index + m[0].length;
  const bracketStart = src.indexOf("[", searchFrom);
  if (bracketStart === -1) return null;
  let depth = 0;
  for (let i = bracketStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) return src.slice(bracketStart, i + 1);
    }
  }
  return null;
}

/** Extract `{ q: "...", a: "..." }` FAQ entries from a `faq: [...]` array literal string. */
function extractFaqEntries(blockStr) {
  if (!blockStr) return [];
  const arrStr = extractArrayLiteral(blockStr, /\bfaq:\s*/);
  if (!arrStr) return [];
  const objStrs = splitTopLevelObjects(arrStr);
  const entries = [];
  for (const objStr of objStrs) {
    const q = field(objStr, "q");
    const a = field(objStr, "a");
    if (q && a) entries.push({ question: q, answer: a });
  }
  return entries;
}

function splitTopLevelObjects(arrayBodyStr) {
  const objects = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < arrayBodyStr.length; i++) {
    const c = arrayBodyStr[i];
    if (c === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        objects.push(arrayBodyStr.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objects;
}

function unescapeJsString(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

/** Extract a `key: "value"` field from a plain JS object literal string. */
function field(objStr, name) {
  if (!objStr) return null;
  const re = new RegExp(name + ':\\s*"((?:[^"\\\\]|\\\\.)*)"');
  const m = re.exec(objStr);
  return m ? unescapeJsString(m[1]) : null;
}

/** Extract a numeric `key: 123` field from a plain JS object literal string. */
function numField(objStr, name) {
  if (!objStr) return null;
  const re = new RegExp(name + ":\\s*(\\d+)");
  const m = re.exec(objStr);
  return m ? Number(m[1]) : null;
}

/** Extract a `key="value"` prop from a JSX tag's attribute string. */
function attr(tagStr, name) {
  if (!tagStr) return null;
  const re = new RegExp(name + '="((?:[^"\\\\]|\\\\.)*)"');
  const m = re.exec(tagStr);
  return m ? unescapeJsString(m[1]) : null;
}

/**
 * Extract a `key: "value"` field that may be written either as a plain
 * string or as a `key: isRu ? "ruValue" : "enValue"` ternary (the pattern
 * used inline in `taxiServiceJsonLd({...})` calls on Seo-tag pages, e.g.
 * minsk-riga-airport.tsx). Returns { ru, en } — both equal to the plain
 * value when no ternary is present.
 */
function langField(objStr, name) {
  if (!objStr) return { ru: null, en: null };
  const ternaryRe = new RegExp(
    name + ':\\s*isRu\\s*\\?\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"',
  );
  const tm = ternaryRe.exec(objStr);
  if (tm) return { ru: unescapeJsString(tm[1]), en: unescapeJsString(tm[2]) };
  const plain = field(objStr, name);
  return { ru: plain, en: plain };
}

function stripComfortLineSuffix(s) {
  return s ? s.replace(/\s*\|\s*ComfortLine.*$/i, "").trim() : s;
}

function slugFromPath(p) {
  return p.replace(/^\//, "").replace(/\//g, "-") || "home";
}

// ----------------------------------------------------------------------------
// Auto-extraction over src/pages/*.tsx
//
// Two conventions are used across the codebase:
//  (a) `const data: RoutePageData/CountryPageData = { ru: {...}, en: {...}, seo: {...} }`
//  (b) `<Seo titleRu="..." titleEn="..." .../>` + `const content = { ru: {...}, en: {...} }`
// ----------------------------------------------------------------------------

const TEMPLATE_FILES = new Set([
  "route-landing-page.tsx",
  "belarus-city-routes.tsx",
  "belarus-city-routes-index.tsx",
  "country-transfer-page.tsx",
  "vehicle-page.tsx",
  "not-found.tsx",
]);
// Handled with hand-curated entries below because they don't fit either
// convention (query-param language switch, or a bespoke content shape).
const MANUAL_FILES = new Set(["landing.tsx", "faq.tsx", "terms.tsx", "privacy-policy.tsx"]);
// Excluded entirely: brandbook is noindex, thank-you has no static <Seo/> (client-only redirect target).
const EXCLUDED_FILES = new Set(["brandbook.tsx", "thank-you.tsx"]);

function extractRouteFromPageSource(src) {
  const dataTypeMatch = /const\s+data\s*:\s*(\w+)\s*=\s*/.exec(src);
  const dataObj = extractObjectLiteral(src, /const\s+data\s*:\s*\w+\s*=\s*/);
  if (dataObj) {
    const ruBlock = extractObjectLiteral(dataObj, /\bru:\s*/);
    const enBlock = extractObjectLiteral(dataObj, /\ben:\s*/);
    const seoBlock = extractObjectLiteral(dataObj, /\bseo:\s*/);
    if (!seoBlock) return null;
    // CountryPageData routes (e.g. france-transfer.tsx) cover many
    // destinations at once and never carry a single fromName/toName pair —
    // the client renders no service-specific JSON-LD for them either.
    const isCountryPage = dataTypeMatch && dataTypeMatch[1] === "CountryPageData";
    // RouteSeo.fromName/toName are plain (RU-only) strings reused verbatim
    // for both languages at runtime by RouteLandingPage — mirror that here
    // rather than inventing a translation that the live site doesn't have.
    const fromName = isCountryPage ? null : field(seoBlock, "fromName");
    const toName = isCountryPage ? null : field(seoBlock, "toName");
    return {
      h1Ru: field(ruBlock, "title"),
      introRu: field(ruBlock, "subtitle"),
      h1En: field(enBlock, "title"),
      introEn: field(enBlock, "subtitle"),
      titleRu: field(seoBlock, "titleRu"),
      titleEn: field(seoBlock, "titleEn"),
      descRu: field(seoBlock, "descRu"),
      descEn: field(seoBlock, "descEn"),
      pathRu: field(seoBlock, "pathRu"),
      pathEn: field(seoBlock, "pathEn"),
      pageType: isCountryPage ? "country" : "service",
      fromNameRu: fromName,
      fromNameEn: fromName,
      toNameRu: toName,
      toNameEn: toName,
    };
  }

  const seoTagMatch = /<Seo\b([\s\S]*?)\/>/.exec(src);
  if (!seoTagMatch) return null;
  const seoTag = seoTagMatch[1];
  if (/\bnoindex\b/.test(seoTag)) return null;

  const contentObj = extractObjectLiteral(src, /const\s+content\s*=\s*/);
  const ruBlock = contentObj ? extractObjectLiteral(contentObj, /\bru:\s*/) : null;
  const enBlock = contentObj ? extractObjectLiteral(contentObj, /\ben:\s*/) : null;

  const titleRu = attr(seoTag, "titleRu");
  const titleEn = attr(seoTag, "titleEn");
  const descRu = attr(seoTag, "descRu");
  const descEn = attr(seoTag, "descEn");

  // Seo-tag pages (airport pages, mercedes-v-class.tsx) build their service
  // JSON-LD inline via `jsonLd={taxiServiceJsonLd({ fromName, toName, ... })}`
  // rather than a data-object seo block. Only pages with that call are real
  // transfer services; others (europe-transfer.tsx) get no service schema.
  const taxiServiceBlock = extractObjectLiteral(src, /taxiServiceJsonLd\(\s*/);
  const fromNameField = langField(taxiServiceBlock, "fromName");
  const toNameField = langField(taxiServiceBlock, "toName");
  // The Europe overview uses an inline bilingual H1, not content.ru/en.title.
  const inlineHeading = /<h1\b[^>]*>\s*\{isRu\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\}/.exec(src);

  return {
    h1Ru: field(ruBlock, "title") || inlineHeading?.[1] || stripComfortLineSuffix(titleRu),
    introRu: field(ruBlock, "subtitle") || field(ruBlock, "seoIntro") || descRu,
    h1En: field(enBlock, "title") || inlineHeading?.[2] || stripComfortLineSuffix(titleEn),
    introEn: field(enBlock, "subtitle") || field(enBlock, "seoIntro") || descEn,
    titleRu,
    titleEn,
    descRu,
    descEn,
    pathRu: attr(seoTag, "pathRu"),
    pathEn: attr(seoTag, "pathEn"),
    faqRu: extractFaqEntries(ruBlock),
    faqEn: extractFaqEntries(enBlock),
    pageType: taxiServiceBlock ? "service" : "other",
    fromNameRu: fromNameField.ru,
    fromNameEn: fromNameField.en,
    toNameRu: toNameField.ru,
    toNameEn: toNameField.en,
  };
}

// ----------------------------------------------------------------------------
// faq.tsx — a bespoke shape (MANUAL_FILES): ruFaq/enFaq are FaqSection[] with
// nested `items: FaqItem[]`, not a flat `faq: [...]` like the other pages.
// ----------------------------------------------------------------------------

function collectManualFaqEntries(varName) {
  const src = fs.readFileSync(path.join(PAGES_DIR, "faq.tsx"), "utf8");
  const arrStr = extractArrayLiteral(src, new RegExp(`const\\s+${varName}\\s*:[^=]*=\\s*`));
  if (!arrStr) {
    console.warn(`[route-manifest] WARNING: could not parse ${varName} array from faq.tsx`);
    return [];
  }
  const sectionStrs = splitTopLevelObjects(arrStr.slice(1, -1));
  const entries = [];
  for (const sectionStr of sectionStrs) {
    const itemsArr = extractArrayLiteral(sectionStr, /items:\s*/);
    if (!itemsArr) continue;
    const itemStrs = splitTopLevelObjects(itemsArr.slice(1, -1));
    for (const itemStr of itemStrs) {
      const q = field(itemStr, "q");
      const a = field(itemStr, "a");
      if (q && a) entries.push({ question: q, answer: a });
    }
  }
  return entries;
}

function collectAutoRoutes() {
  const out = [];
  for (const file of fs.readdirSync(PAGES_DIR)) {
    if (!file.endsWith(".tsx")) continue;
    if (TEMPLATE_FILES.has(file) || MANUAL_FILES.has(file) || EXCLUDED_FILES.has(file)) continue;
    const src = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    const extracted = extractRouteFromPageSource(src);
    if (!extracted || !extracted.pathRu || !extracted.pathEn || !extracted.titleRu || !extracted.titleEn) {
      console.warn(`[route-manifest] WARNING: could not extract SEO route metadata from src/pages/${file} — skipping.`);
      continue;
    }
    out.push({ ogSlug: slugFromPath(extracted.pathEn), ...extracted });
  }
  return out;
}

// Bilingual city routes are kept as human-curated JSON so that the metadata,
// prerendered document, and rendered booking route always refer to the same city.
function collectBelarusCityRoutes() {
  const entries = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", "belarus-city-route-pages.json"), "utf8"));
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", "belarus-city-route-catalog.json"), "utf8"));
  return entries.map((entry) => ({
    ogSlug: slugFromPath(entry.pathEn),
    pageType: "service",
    pathRu: entry.pathRu,
    pathEn: entry.pathEn,
    titleRu: entry.titleRu,
    titleEn: entry.titleEn,
    descRu: entry.descRu,
    descEn: entry.descEn,
    h1Ru: entry.h1Ru,
    h1En: entry.h1En,
    introRu: entry.introRu,
    introEn: entry.introEn,
    fromNameRu: catalog.cities[entry.from].ru,
    fromNameEn: catalog.cities[entry.from].en,
    toNameRu: catalog.cities[entry.to].ru,
    toNameEn: catalog.cities[entry.to].en,
  }));
}

// ----------------------------------------------------------------------------
// vehicle-page.tsx — parameterized by slug via `vehicleSeo` + `vehicleContent` maps.
// ----------------------------------------------------------------------------

function collectVehicleRoutes() {
  const src = fs.readFileSync(path.join(PAGES_DIR, "vehicle-page.tsx"), "utf8");
  const seoMapStr = extractObjectLiteral(src, /const\s+vehicleSeo\s*:[^=]*=\s*/);
  const contentMapStr = extractObjectLiteral(src, /const\s+vehicleContent\s*:[^=]*=\s*/);
  if (!seoMapStr || !contentMapStr) {
    console.warn("[route-manifest] WARNING: could not parse vehicleSeo/vehicleContent maps from vehicle-page.tsx");
    return [];
  }

  function mapEntries(mapStr) {
    const entries = {};
    const keyRe = /"([a-z0-9-]+)":\s*/g;
    let m;
    while ((m = keyRe.exec(mapStr))) {
      const slug = m[1];
      const objStr = extractObjectLiteral(mapStr, new RegExp(`"${slug}":\\s*`));
      if (objStr) entries[slug] = objStr;
    }
    return entries;
  }

  const seoEntries = mapEntries(seoMapStr);
  const contentEntries = mapEntries(contentMapStr);

  const routes = [];
  for (const slug of Object.keys(seoEntries)) {
    const seoStr = seoEntries[slug];
    const contentStr = contentEntries[slug];
    const ruBlock = contentStr ? extractObjectLiteral(contentStr, /\bru:\s*/) : null;
    const enBlock = contentStr ? extractObjectLiteral(contentStr, /\ben:\s*/) : null;
    const titleRu = field(seoStr, "titleRu");
    const titleEn = field(seoStr, "titleEn");
    routes.push({
      ogSlug: slug,
      pathRu: field(seoStr, "pathRu"),
      pathEn: field(seoStr, "pathEn"),
      titleRu,
      titleEn,
      descRu: field(seoStr, "descRu"),
      descEn: field(seoStr, "descEn"),
      h1Ru: field(ruBlock, "name") || stripComfortLineSuffix(titleRu),
      h1En: field(enBlock, "name") || stripComfortLineSuffix(titleEn),
      introRu: field(ruBlock, "desc") || field(seoStr, "descRu"),
      introEn: field(enBlock, "desc") || field(seoStr, "descEn"),
      pageType: "vehicle",
      isVehicle: true,
      vehicleImage: field(ruBlock, "image") || field(enBlock, "image"),
      vehicleSeats: numField(ruBlock, "seats") || numField(enBlock, "seats"),
      vehicleYear: field(ruBlock, "year") || field(enBlock, "year"),
      vehicleClassRu: field(ruBlock, "classBadge"),
      vehicleClassEn: field(enBlock, "classBadge"),
    });
  }
  return routes;
}

// ----------------------------------------------------------------------------
// Blog articles — parsed directly from src/data/blog-articles.ts so EN/RU
// fields (slugEn/titleEn/descriptionEn/introEn) always match the live data
// instead of a manually duplicated (and easily stale) list.
// ----------------------------------------------------------------------------

function collectBlogRoutes() {
  const src = fs.readFileSync(path.join(ROOT, "src", "data", "blog-articles.ts"), "utf8");
  const arrMatch = /export const ARTICLES\s*:\s*Article\[\]\s*=\s*\[/.exec(src);
  if (!arrMatch) {
    console.warn("[route-manifest] WARNING: could not find ARTICLES array in blog-articles.ts");
    return { blogIndexRoute: null, blogArticleRoutes: [] };
  }
  const arrStart = arrMatch.index + arrMatch[0].length - 1; // position of the opening "["
  let depth = 0;
  let arrEnd = -1;
  for (let i = arrStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        arrEnd = i;
        break;
      }
    }
  }
  const arrBody = src.slice(arrStart + 1, arrEnd);
  const objStrs = splitTopLevelObjects(arrBody);

  const blogArticleRoutes = [];
  for (const objStr of objStrs) {
    const slug = field(objStr, "slug");
    const slugEn = field(objStr, "slugEn");
    const ogSlug = field(objStr, "ogSlug");
    const title = field(objStr, "title");
    const titleEn = field(objStr, "titleEn");
    const description = field(objStr, "description");
    const descriptionEn = field(objStr, "descriptionEn");
    const intro = field(objStr, "intro");
    const introEn = field(objStr, "introEn");
    const dateISO = field(objStr, "dateISO");
    const dateModified = field(objStr, "dateModified");
    const category = field(objStr, "category");
    const categoryEn = field(objStr, "categoryEn");
    const tagsMatch = /\btags:\s*\[([^\]]*)\]/.exec(objStr);
    const tags = tagsMatch
      ? tagsMatch[1]
          .split(",")
          .map((t) => t.trim().replace(/^"|"$/g, ""))
          .filter(Boolean)
      : [];

    if (!slug || !title || !description || !intro) {
      console.warn(`[route-manifest] WARNING: incomplete blog article entry (slug=${slug}) — skipping.`);
      continue;
    }
    if (!slugEn || !titleEn || !descriptionEn || !introEn) {
      console.warn(
        `[route-manifest] WARNING: blog article "${slug}" is missing EN fields (slugEn/titleEn/descriptionEn/introEn) — falling back to RU for the English variant.`,
      );
    }

    blogArticleRoutes.push({
      ogSlug: ogSlug || `blog-${slug}`,
      pathRu: `/блог/${slug}`,
      pathEn: `/blog/${slugEn || slug}`,
      titleRu: field(objStr, "seoTitle") || `${title} | Блог ComfortLine`,
      titleEn: field(objStr, "seoTitleEn") || `${titleEn || title} | ComfortLine Blog`,
      descRu: description,
      descEn: descriptionEn || description,
      h1Ru: title,
      h1En: titleEn || title,
      introRu: intro,
      introEn: introEn || intro,
      isArticle: true,
      datePublished: dateISO,
      dateModified: dateModified || dateISO,
      section: category,
      sectionEn: categoryEn || category,
      keywords: tags.join(", "),
    });
  }

  const blogIndexRoute = {
    ogSlug: "blog-index",
    pathRu: "/блог",
    pathEn: "/blog",
    titleRu: "Блог ComfortLine — гайды по трансферу, границе и аэропортам",
    titleEn: "ComfortLine Blog — guides on transfers, border and airports",
    descRu:
      "Гайды по трансферу из Минска: пересечение границы Беларусь–Литва, стоимость поездок, что нельзя ввозить в ЕС, выбор КПП, советы для семей с детьми.",
    descEn:
      "Guides on Minsk transfers: Belarus–Lithuania border crossings, pricing, EU customs rules, picking a border checkpoint, family travel tips.",
    h1Ru: "Блог ComfortLine",
    h1En: "ComfortLine Blog",
    introRu:
      "Практические гайды по трансферу, пересечению границы и аэропортам Европы. Опыт водителей ComfortLine за 8 лет работы.",
    introEn: "Practical guides on transfers, border crossings and European airports. 8 years of ComfortLine driver experience.",
  };

  return { blogIndexRoute, blogArticleRoutes };
}

// ----------------------------------------------------------------------------
// Manually curated entries.
//
// These four routes (/, /faq, /terms, /privacy) share the same page
// component between languages in App.tsx, but each language now has its own
// distinct path — the RU path (/, /faq, /terms, /privacy) and a matching
// path-based English shell (/en, /en/faq, /en/terms, /en/privacy). Both are
// registered as separate wouter <Route>s pointing at the same component, so
// each gets its own prerendered HTML file with correct <html lang>, hreflang,
// and (for /en, /en/faq, etc.) real SSR-rendered English markup.
// ----------------------------------------------------------------------------

const manualRoutes = [
  {
    ogSlug: "belarus-city-transfers",
    pageType: "other",
    pathRu: "/трансферы-по-городам-беларуси",
    pathEn: "/belarus-city-transfers",
    titleRu: "Трансферы по городам Беларуси и Европы | ComfortLine",
    titleEn: "Belarus City Transfers from Europe | ComfortLine",
    descRu: "Индивидуальные трансферы между Гродно, Брестом, Витебском, Гомелем, Могилёвом, Лидой, Барановичами и городами ЕС. Маршруты в обе стороны.",
    descEn: "Private transfers between major Belarusian cities and Vilnius, Warsaw or Riga. Explore both directions, pickup details and destination landmarks.",
    h1Ru: "Трансферы между городами Беларуси и Европы",
    h1En: "Private transfers between Belarusian cities and Europe",
    introRu: "Выберите конкретное направление, чтобы узнать об адресах подачи, возможностях поездки и достопримечательностях города назначения.",
    introEn: "Choose a direction to review pickup options, route-specific considerations and authentic landmarks in the destination city.",
  },
  {
    ogSlug: "home",
    pageType: "home",
    pathRu: "/",
    pathEn: "/en",
    titleRu: "Трансферы по Беларуси и в Европу | ComfortLine",
    titleEn: "Private Transfers in Belarus and to Europe | ComfortLine",
    descRu:
      "Выберите трансфер по Беларуси или между Минском, Вильнюсом, Варшавой и Ригой. Смотрите маршруты и начальные цены. Запросите стоимость поездки у водителя.",
    descEn:
      "Plan a private transfer within Belarus or between Minsk, Vilnius, Warsaw and Riga. Compare city and airport routes, see starting fares and request a quote.",
    h1Ru: "ComfortLine — комфортный трансфер из Минска",
    h1En: "ComfortLine — Comfortable Transfers from Minsk",
    introRu:
      "Выберите трансфер по Беларуси или между Минском, Вильнюсом, Варшавой и Ригой. Смотрите маршруты и начальные цены. Запросите стоимость поездки у водителя.",
    introEn:
      "Plan a private transfer within Belarus or between Minsk, Vilnius, Warsaw and Riga. Compare city and airport routes, see starting fares and request a quote.",
  },
  {
    ogSlug: "faq",
    pageType: "faq",
    pathRu: "/faq",
    pathEn: "/en/faq",
    titleRu: "FAQ — Частые вопросы о трансфере | ComfortLine",
    titleEn: "FAQ — Transfer Questions Answered | ComfortLine",
    descRu:
      "Ответы на частые вопросы о трансфере ComfortLine: бронирование, цены, оплата, граница, документы, детские кресла.",
    descEn:
      "Answers to frequently asked questions about ComfortLine transfers: booking, pricing, payment, borders, documents, child seats, luggage.",
    h1Ru: "FAQ — Частые вопросы о трансфере",
    h1En: "FAQ — Transfer Questions Answered",
    introRu:
      "Ответы на частые вопросы о трансфере ComfortLine: бронирование, цены, оплата, граница, документы, детские кресла, багаж и встречи в аэропортах.",
    introEn:
      "Answers to frequently asked questions about ComfortLine transfers: booking, pricing, payment, borders, documents, child seats, luggage, and airport meet-and-greet.",
  },
  {
    ogSlug: "terms",
    pageType: "legal",
    pathRu: "/terms",
    pathEn: "/en/terms",
    titleRu: "Публичная оферта и условия | ComfortLine",
    titleEn: "Public Offer & Terms | ComfortLine",
    descRu:
      "Публичная оферта ComfortLine: условия предоставления услуг трансфера, права и обязанности сторон, оплата и отмена бронирования.",
    descEn:
      "ComfortLine public offer & terms: transfer service conditions, rights and obligations of the parties, payment and cancellation.",
    h1Ru: "Публичная оферта",
    h1En: "Public Offer (Terms of Service)",
    introRu: "на оказание услуг по организации индивидуального трансфера",
    introEn: "Private transfer and chauffeur services",
  },
  {
    ogSlug: "privacy",
    pageType: "legal",
    pathRu: "/privacy",
    pathEn: "/en/privacy",
    titleRu: "Политика конфиденциальности | ComfortLine",
    titleEn: "Privacy Policy | ComfortLine",
    descRu:
      "Политика конфиденциальности ComfortLine: как мы обрабатываем персональные данные клиентов трансфера и обеспечиваем их защиту.",
    descEn: "ComfortLine privacy policy — how we process and protect personal data of our transfer customers.",
    h1Ru: "Политика обработки персональных данных",
    h1En: "Personal Data Processing Policy",
    introRu: "ИП Мурашко Андрей Антонович (Comfortline.by)",
    introEn: "Sole Proprietor Murashko Andrei Antonovich (Comfortline.by)",
  },
];

/**
 * Keep crawler-visible metadata within practical SERP limits. This runs after
 * all localized route variants have been assembled, so blog suffixes and
 * fallback values are measured exactly as prerender will emit them.
 */
export function validateRouteMetadata(routes) {
  const errors = [];
  for (const route of routes) {
    for (const [language, pathKey] of [
      ["ru", "pathRu"],
      ["en", "pathEn"],
    ]) {
      const path = route[pathKey] || "(missing path)";
      const title = route[`title${language === "ru" ? "Ru" : "En"}`];
      const description = route[`desc${language === "ru" ? "Ru" : "En"}`];
      if (!title) {
        errors.push(`${path} [${language}] is missing title`);
      } else if (title.length > 60) {
        errors.push(`${path} [${language}] title is ${title.length} characters (max 60)`);
      }
      if (!description) {
        errors.push(`${path} [${language}] is missing description`);
      } else if (description.length > 160) {
        errors.push(`${path} [${language}] description is ${description.length} characters (max 160)`);
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(`[route-manifest] Metadata validation failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  }
}

/**
 * Build the full, de-duplicated route manifest (manual + auto + vehicle +
 * blog) that both prerender.mjs (HTML/meta) and og-images.mjs (social
 * preview images) consume. Every route in this list carries an `ogSlug`,
 * so any code that iterates it to generate `/og/<ogSlug>.jpg` files is
 * guaranteed to cover every route referenced elsewhere in the build.
 */
export function collectAllRoutes() {
  const autoRoutes = [...collectAutoRoutes(), ...collectBelarusCityRoutes()];
  const vehicleRoutes = collectVehicleRoutes();
  const { blogIndexRoute, blogArticleRoutes } = collectBlogRoutes();

  const faqRoute = manualRoutes.find((r) => r.ogSlug === "faq");
  if (faqRoute) {
    faqRoute.faqRu = collectManualFaqEntries("ruFaq");
    faqRoute.faqEn = collectManualFaqEntries("enFaq");
  }

  const allRoutes = [
    ...manualRoutes,
    ...autoRoutes,
    ...vehicleRoutes,
    ...(blogIndexRoute ? [blogIndexRoute] : []),
    ...blogArticleRoutes,
  ];

  validateRouteMetadata(allRoutes);
  return { allRoutes, manualRoutes, autoRoutes, vehicleRoutes, blogIndexRoute, blogArticleRoutes };
}
