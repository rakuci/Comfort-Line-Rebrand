import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import {
  ARTICLE_IDENTITIES, CHECKPOINT_ROWS, DRIVING_CROSSINGS, EXPECTED_ORIGIN,
  GUIDE_LINKED_FROM, GUIDE_SLUG, VISA_ROWS, VISA_SLUG, EUROPEAN_LAND_COUNTRIES,
} from "../fixtures/blog-policy-expectations.mjs";

export const normalize = (value) => String(value).replace(/\s+/g, " ").trim();
export const bodyFor = (article, lang) => lang === "ru" ? article.body : article.bodyEn;
export const pathFor = (article, lang) => lang === "ru" ? `/блог/${article.slug}` : `/blog/${article.slugEn}`;
const firstTable = (body) => body.find((b) => b.type === "table");
const bodyText = (body) => normalize(body.map((b) => b.text ?? b.items?.join(" ") ?? "").join(" "));
const requireText = (text, fragments, context) => {
  for (const fragment of fragments) assert(text.includes(fragment), `${context}: missing reviewed condition "${fragment}"`);
};
function section(body, headingPattern) {
  const start = body.findIndex((b) => b.type === "h2" && headingPattern.test(b.text));
  assert(start >= 0, `Missing section ${headingPattern}`);
  const end = body.findIndex((b, i) => i > start && b.type === "h2");
  return body.slice(start, end < 0 ? undefined : end);
}

// These checks use a dated editorial baseline, not the new guide as an oracle.
export function validateBlogSources(articles, { routes, europeanCountries } = {}) {
  assert.equal(articles.length, ARTICLE_IDENTITIES.length, "Article identities changed: review the explicit baseline");
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  assert.equal(bySlug.size, articles.length, "Duplicate RU article identity");
  assert.equal(new Set(articles.map((a) => a.slugEn)).size, articles.length, "Duplicate EN article identity");
  const knownPaths = new Set(articles.flatMap((a) => ["ru", "en"].map((l) => pathFor(a, l))));
  const guide = bySlug.get(GUIDE_SLUG);
  for (const [slug, slugEn, ogSlug, dateISO] of ARTICLE_IDENTITIES) {
    const article = bySlug.get(slug);
    assert(article, `Original article lost: ${slug}`);
    assert.deepEqual([article.slugEn, article.ogSlug, article.dateISO], [slugEn, ogSlug, dateISO], `Publication identity changed: ${slug}`);
    for (const lang of ["ru", "en"]) {
      const context = `${slug} [${lang}]`;
      const body = bodyFor(article, lang);
      assert(body?.length > 0, `${context}: missing translated body (RU fallback is not acceptable)`);
      for (const block of body.filter((b) => b.type === "link")) {
        if (!block.href.startsWith("/")) continue;
        const pathname = decodeURIComponent(new URL(block.href, EXPECTED_ORIGIN).pathname).replace(/\/$/, "");
        if (!/^\/(блог|blog)\//.test(pathname)) continue;
        assert(knownPaths.has(pathname), `${context}: broken blog link ${block.href}`);
        assert(pathname.startsWith(lang === "ru" ? "/блог/" : "/blog/"), `${context}: wrong-language blog link ${block.href}`);
      }
      if (GUIDE_LINKED_FROM.includes(slug)) {
        assert(body.some((b) => b.type === "link" && b.href === pathFor(guide, lang)), `${context}: missing localized driving-guide link`);
      }
      for (const related of article.related) assert(bySlug.has(related), `${context}: lost related article ${related}`);
      if (routes) {
        const route = routes.find((r) => r.pathRu === pathFor(article, "ru"));
        assert(route, `${context}: build-time parser lost article`);
        assert.equal(route.pathEn, pathFor(article, "en"), `${context}: build-time EN path drift`);
        assert.equal(route[lang === "ru" ? "h1Ru" : "h1En"], lang === "ru" ? article.title : article.titleEn, `${context}: build-time title drift`);
        assert.equal(route.dateModified, article.dateModified ?? article.dateISO, `${context}: build-time update date drift`);
      }
    }
  }
  for (const [slug, expected] of Object.entries(CHECKPOINT_ROWS)) {
    for (const lang of ["ru", "en"]) {
      const table = firstTable(bodyFor(bySlug.get(slug), lang));
      assert(table, `${slug} [${lang}]: checkpoint table missing`);
      assert.deepEqual(table.rows.map((row) => row.slice(0, 3)), expected[lang], `${slug} [${lang}]: dated checkpoint/vehicle policy changed`);
    }
  }
  for (const lang of ["ru", "en"]) {
    const body = bodyFor(guide, lang);
    const rows = firstTable(body).rows;
    assert.deepEqual(rows.map((row) => row.slice(0, 2)), DRIVING_CROSSINGS[lang], `Driving guide [${lang}]: dated checkpoint parity`);
    requireText(rows[0][2], lang === "ru"
      ? ["Bobrowniki: легковые и автобусы", "Kuźnica: легковые, без автобусов", "Połowce и Sławatycze закрыты"]
      : ["Bobrowniki takes cars and coaches", "Kuźnica takes cars but not coaches", "Połowce and Sławatycze remain closed"], `Driving guide [${lang}]: Poland`);
    requireText(rows[1][2], lang === "ru"
      ? ["без пешеходов и велосипедов", "Работа в день поездки не подтверждается", "Kotlovka/Lavoriškės", "Privalka/Raigardas"]
      : ["no pedestrians/cycles", "does not confirm travel-day operation", "Lavoriškės/Kotlovka", "Raigardas/Privalka"], `Driving guide [${lang}]: Lithuania`);
    requireText(rows[2][2], lang === "ru"
      ? ["ERRS обязательна", "Silene не считайте альтернативой"]
      : ["ERRS booking is compulsory", "do not assume Silene is an alternative"], `Driving guide [${lang}]: Latvia`);
    const passportText = bodyText(section(body, /^3\./));
    requireText(passportText, lang === "ru"
      ? ["38 европейских", "31 декабря 2026", "27 стран ЕС", "11 стран вне ЕС", "до 90 суток за визит", "до 30 суток за визит", "90 суток в календарном году", "автомобильных и железнодорожных", "не даёт автоматического права на безвизовый маршрут через Россию"]
      : ["38 European", "31 December 2026", "27 EU member", "11 non-EU", "up to 90 days per visit", "up to 30 days per visit", "90 days per calendar year", "road and rail", "not a blanket authorization for travel through Russia"], `Driving guide [${lang}]: land visa regime`);

    const visa = bodyFor(bySlug.get(VISA_SLUG), lang);
    assert.deepEqual(firstTable(visa)?.rows, VISA_ROWS[lang], `Visa guide [${lang}]: airport and land regimes must stay distinct`);
    for (const url of ["https://mfa.gov.by/en/visa/freemove/europe", "https://mfa.gov.by/en/visa/freemove/airport"]) {
      assert(visa.some((b) => b.type === "link" && b.href === url), `Visa guide [${lang}]: missing separate official source ${url}`);
    }
    const airport = bodyText(section(visa, lang === "ru" ? /^Режим 1/ : /^Regime 1/));
    requireText(airport, lang === "ru"
      ? ["до 30 суток", "76 государств", "Бреста", "Витебска", "Гомеля", "Гродно", "Могилёва", "Рейсы из России и в Россию исключены", "не через наземную границу", "использованную многократную визу", "билет на вылет"]
      : ["up to 30 days", "76 states", "Brest", "Vitebsk", "Gomel", "Grodno", "Mogilev", "Flights from and to Russia are excluded", "not through a land crossing", "previously used multiple-entry", "outbound flight ticket"], `Visa guide [${lang}]: airport conditions`);
    const land = bodyText(section(visa, lang === "ru" ? /^Режим 2/ : /^Regime 2/));
    requireText(land, lang === "ru"
      ? ["38 европейских", "31 декабря 2026", "до 30 суток", "до 90 суток", "90 суток в календарном году", "негражданам Латвии", "транзит в Россию этим режимом не разрешён"]
      : ["38 European", "31 December 2026", "30 days per entry", "up to 90 days", "90 days per calendar year", "Latvia's non-citizen", "does not permit transit to Russia"], `Visa guide [${lang}]: land conditions`);
  }
  if (europeanCountries) assert.deepEqual([...europeanCountries].sort(), EUROPEAN_LAND_COUNTRIES, "Checker land-visa country set drift");
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  return value && typeof value === "object" ? [value, ...flattenJsonLd(value["@graph"])] : [];
}

// Exported so mutation tests can prove malformed HTML fails without a browser.
export function validateRenderedBlogDocument(html, article, lang) {
  const context = `${pathFor(article, lang)} [rendered ${lang}]`;
  const dom = new JSDOM(html); // No runScripts/resources: intentionally offline.
  try {
    const document = dom.window.document;
    assert.equal(document.documentElement.lang, lang, `${context}: document language`);
    const expectedUrl = new URL(pathFor(article, lang), EXPECTED_ORIGIN).href;
    const canonicals = document.querySelectorAll('head link[rel="canonical"]');
    assert.equal(canonicals.length, 1, `${context}: exactly one canonical required`);
    assert.equal(canonicals[0].href, expectedUrl, `${context}: canonical target`);
    for (const targetLang of ["ru", "en", "x-default"]) {
      const links = document.querySelectorAll(`head link[rel="alternate"][hreflang="${targetLang}"]`);
      assert.equal(links.length, 1, `${context}: exactly one ${targetLang} hreflang required`);
      assert.equal(links[0].href, new URL(pathFor(article, targetLang === "en" ? "en" : "ru"), EXPECTED_ORIGIN).href, `${context}: ${targetLang} hreflang target`);
    }
    const rendered = document.querySelector("#root article");
    assert(rendered, `${context}: missing complete SSR article (summary fallback is not sufficient)`);
    assert.equal(normalize(rendered.querySelector("h1")?.textContent), lang === "ru" ? article.title : article.titleEn, `${context}: translated heading`);
    const body = bodyFor(article, lang);
    const text = normalize(rendered.textContent);
    for (const block of body) {
      // React renders callout paragraphs as adjacent <p> nodes: textContent
      // inserts no separator between them, unlike a visual line break.
      const visible = (s) => block.markdown ? s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, "$1") : s;
      const fragments = [block.text, ...(block.items ?? [])].filter(Boolean).flatMap((s) => s.split("\n\n")).map(visible);
      for (const fragment of fragments) {
        assert(text.includes(normalize(fragment)), `${context}: missing rendered ${block.type} content "${fragment.slice(0, 65)}"`);
      }
      if (block.markdown) {
        const copy = [block.text, ...(block.items ?? []), ...(block.headers ?? []), ...(block.rows ?? []).flat()].filter(Boolean).join("\n");
        for (const [, label, href] of copy.matchAll(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g)) {
          assert([...rendered.querySelectorAll("a[href]")].some((a) => a.href === new URL(href).href && normalize(a.textContent) === normalize(label)), `${context}: lost inline source ${href}`);
        }
      }
      if (block.type === "link") {
        const expected = new URL(block.href, EXPECTED_ORIGIN).href;
        // Link cards wrap a label, icon, source URL and optional description.
        // Match the actual label node, not the card's concatenated text.
        const link = [...rendered.querySelectorAll("a[href]")].find((a) =>
          new URL(a.getAttribute("href"), EXPECTED_ORIGIN).href === expected &&
          [a, ...a.querySelectorAll("*")].some((node) => normalize(node.textContent) === normalize(block.label)));
        assert(link, `${context}: lost/changed rendered link ${block.href}`);
        if (block.description) assert(normalize(link.textContent).includes(normalize(block.description)), `${context}: missing rendered link description ${block.href}`);
      }
    }
    const tables = [...rendered.querySelectorAll("table")];
    const sourceTables = body.filter((b) => b.type === "table");
    assert.equal(tables.length, sourceTables.length, `${context}: table count drift`);
    for (let i = 0; i < tables.length; i++) {
      const visible = (s) => normalize(sourceTables[i].markdown ? s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, "$1") : s);
      const rows = [...tables[i].querySelectorAll("tbody tr")].map((row) => [...row.querySelectorAll("td")].map((cell) => normalize(cell.textContent)));
      assert.deepEqual(rows, sourceTables[i].rows.map((row) => row.map(visible)), `${context}: table ${i + 1} differs from source`);
      assert.deepEqual([...tables[i].querySelectorAll("th")].map((cell) => normalize(cell.textContent)), sourceTables[i].headers.map(visible), `${context}: table headings drift`);
    }
    const structured = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => flattenJsonLd(JSON.parse(s.textContent)));
    const articles = structured.filter((s) => [].concat(s["@type"]).includes("Article"));
    assert.equal(articles.length, 1, `${context}: exactly one structured Article required`);
    assert.equal(articles[0].datePublished, article.dateISO, `${context}: original publication date`);
    assert.equal(articles[0].dateModified, article.dateModified ?? article.dateISO, `${context}: updated editorial date`);
    assert.equal(articles[0].inLanguage, lang, `${context}: structured language`);
    assert.equal(articles[0].headline, lang === "ru" ? article.title : article.titleEn, `${context}: structured identity`);
    assert.equal(new URL(articles[0].mainEntityOfPage["@id"], EXPECTED_ORIGIN).href, expectedUrl, `${context}: structured canonical identity`);
  } finally {
    dom.window.close();
  }
}

export function validateRenderedBlogPages(articles, distDirectory) {
  for (const article of articles) for (const lang of ["ru", "en"]) {
    const path = join(distDirectory, pathFor(article, lang), "index.html");
    let html;
    try { html = readFileSync(path, "utf8"); }
    catch { throw new Error(`Missing rendered blog page ${path}; build/prerender before running the rendered checks`); }
    validateRenderedBlogDocument(html, article, lang);
  }
  return articles.length * 2;
}
