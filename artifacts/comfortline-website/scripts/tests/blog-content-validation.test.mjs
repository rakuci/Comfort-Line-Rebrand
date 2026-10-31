import assert from "node:assert/strict";
import { test } from "node:test";
import { createDataLoader } from "../lib/load-blog-data.mjs";
import { validateBlogSources, validateRenderedBlogDocument } from "../lib/blog-content-validation.mjs";
import { GUIDE_SLUG, VISA_SLUG, EXPECTED_ORIGIN } from "../fixtures/blog-policy-expectations.mjs";

const { ARTICLES } = createDataLoader()("blog-articles");
function rejectsMutation(name, mutate, message) {
  test(name, () => {
    const articles = structuredClone(ARTICLES);
    mutate(articles);
    assert.throws(() => validateBlogSources(articles), message);
  });
}
const find = (articles, slug) => articles.find((a) => a.slug === slug);
test("current independently dated source baseline passes", () => validateBlogSources(ARTICLES));
rejectsMutation("a deleted older article fails", (a) => a.pop(), /identities changed/);
for (const field of ["slugEn", "ogSlug", "dateISO"]) {
  rejectsMutation(`changing original ${field} fails`, (a) => { a[1][field] = "changed"; }, /identity changed/);
}
rejectsMutation("a missing English body fails rather than allowing RU fallback", (a) => { delete a[1].bodyEn; }, /missing translated body/);
rejectsMutation("a broken driving-guide target fails", (a) => {
  find(a, "граница-беларусь-литва").bodyEn.find((b) => b.type === "link" && b.href.includes("driving-to")).href += "-typo";
}, /broken blog link/);
rejectsMutation("an English driving-guide link pointing to Russian fails", (a) => {
  find(a, "граница-беларусь-литва").bodyEn.find((b) => b.type === "link" && b.href.includes("driving-to")).href = `/блог/${GUIDE_SLUG}`;
}, /wrong-language blog link/);
rejectsMutation("removing a required legacy-to-driving link fails", (a) => {
  const article = find(a, "граница-беларусь-литва");
  article.bodyEn = article.bodyEn.filter((b) => !(b.type === "link" && b.href.includes("driving-to")));
}, /missing localized driving-guide link/);
rejectsMutation("one translation changing a checkpoint restriction fails", (a) => {
  find(a, "граница-беларусь-польша").bodyEn.find((b) => b.type === "table").rows[2][2] = "Cars and coaches";
}, /checkpoint\/vehicle policy changed/);
rejectsMutation("both translations repeating the same wrong reopening still fails", (a) => {
  const article = find(a, "граница-беларусь-литва");
  article.body.find((b) => b.type === "table").rows[2][2] = "Открыт";
  article.bodyEn.find((b) => b.type === "table").rows[2][2] = "Open";
}, /checkpoint\/vehicle policy changed/);
rejectsMutation("land and airport country counts cannot be swapped", (a) => {
  find(a, VISA_SLUG).bodyEn.find((b) => b.type === "table").rows[1][3] = "76 states";
}, /airport and land regimes must stay distinct/);
rejectsMutation("an expired or extended visa cutoff requires a baseline review", (a) => {
  find(a, VISA_SLUG).body.find((b) => b.type === "table").rows[1][3] = "38 европейских государств; до 31.12.2027";
}, /airport and land regimes must stay distinct/);
rejectsMutation("dropping the airport-only departure condition fails", (a) => {
  const article = find(a, VISA_SLUG);
  article.bodyEn.find((b) => b.type === "ul" && b.items.some((s) => s.includes("six listed airports"))).items =
    ["Duration — no more than 30 days.", "You may leave at any border."];
}, /airport conditions/);
rejectsMutation("a broken related-article identity fails", (a) => {
  a[0].related.push("not-an-article");
}, /lost related article/);
test("a changed checker country set requires deliberate review", () => {
  assert.throws(() => validateBlogSources(ARTICLES, { europeanCountries: new Set(["DE"]) }), /country set drift/);
});
test("a build-time parser path mismatch fails", () => {
  assert.throws(() => validateBlogSources(ARTICLES, { routes: [] }), /parser lost article/);
});

// Small synthetic HTML tests exercise the validator itself before a dist folder
// exists. Production checks separately read EVERY real generated blog page.
const fixture = {
  slug: "пример", slugEn: "example", title: "Пример", titleEn: "Example",
  dateISO: "2026-01-01", dateModified: "2026-10-16",
  body: [
    { type: "p", text: "Русский текст" },
    { type: "table", headers: ["Правило"], rows: [["30 суток"]] },
    { type: "link", href: "/блог/пример", label: "Источник" },
  ],
  bodyEn: [
    { type: "p", text: "English content" },
    { type: "table", headers: ["Rule"], rows: [["30 days"]] },
    { type: "link", href: "/blog/example", label: "Source" },
  ],
};
const ruUrl = new URL("/блог/пример", EXPECTED_ORIGIN).href;
const enUrl = `${EXPECTED_ORIGIN}/blog/example`;
const validHtml = `<!doctype html><html lang="en"><head>
<link rel="canonical" href="${enUrl}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${ruUrl}">
<script type="application/ld+json">${JSON.stringify({
  "@type": "Article", headline: "Example", datePublished: fixture.dateISO,
  dateModified: fixture.dateModified, inLanguage: "en",
  mainEntityOfPage: { "@id": enUrl },
})}</script></head><body><div id="root"><article><h1>Example</h1>
<p>English content</p><table><thead><tr><th>Rule</th></tr></thead>
<tbody><tr><td>30 days</td></tr></tbody></table>
<a href="/blog/example">Source</a></article></div></body></html>`;
test("complete localized rendered HTML passes", () => validateRenderedBlogDocument(validHtml, fixture, "en"));
test("Markdown emphasis and inline sources render as text and real links, not raw Markdown", () => {
  const article = structuredClone(fixture);
  article.bodyEn[0] = { type: "p", text: "**English** [content](https://example.org/official)", markdown: true };
  const html = validHtml.replace("<p>English content</p>", '<p><strong>English</strong> <a href="https://example.org/official">content</a></p>');
  validateRenderedBlogDocument(html, article, "en");
  assert.throws(() => validateRenderedBlogDocument(html.replace('href="https://example.org/official"', 'href="https://example.org/wrong"'), article, "en"), /lost inline source/);
});
test("a decorated link card retains its exact label and description", () => {
  const article = structuredClone(fixture);
  article.bodyEn[2].description = "Separate source note";
  const html = validHtml.replace(">Source</a>", '><span>↗</span><span><span>Source</span><span>Separate source note</span><span>/blog/example</span></span></a>');
  validateRenderedBlogDocument(html, article, "en");
  assert.throws(() => validateRenderedBlogDocument(html.replace(">Source</span>", ">Wrong label</span>"), article, "en"), /rendered link/);
  assert.throws(() => validateRenderedBlogDocument(html.replace("Separate source note", ""), article, "en"), /link description/);
});
test("separate callout paragraphs do not need literal whitespace between DOM nodes", () => {
  const article = structuredClone(fixture);
  article.bodyEn.push({ type: "callout", text: "First paragraph\n\nSecond paragraph" });
  const html = validHtml.replace("</article>", "<div><p>First paragraph</p><p>Second paragraph</p></div></article>");
  validateRenderedBlogDocument(html, article, "en");
  assert.throws(() => validateRenderedBlogDocument(html.replace("<p>Second paragraph</p>", ""), article, "en"), /missing rendered callout/);
});
for (const [name, from, to, expected] of [
  ["wrong canonical", `rel="canonical" href="${enUrl}"`, `rel="canonical" href="${ruUrl}"`, /canonical target/],
  ["wrong hreflang", `hreflang="en" href="${enUrl}"`, `hreflang="en" href="${ruUrl}"`, /en hreflang target/],
  ["summary fallback", "<article>", "<section>", /missing complete SSR article/],
  ["wrong document language", 'lang="en"', 'lang="ru"', /document language/],
  ["missing text", "English content", "Wrong content", /missing rendered p/],
  ["changed table", "<td>30 days</td>", "<td>90 days</td>", /table 1 differs/],
  ["changed link", 'href="/blog/example"', 'href="/блог/пример"', /rendered link/],
  ["stale update date", '"dateModified":"2026-10-16"', '"dateModified":"2026-01-01"', /updated editorial date/],
  ["wrong structured identity", '"headline":"Example"', '"headline":"Пример"', /structured identity/],
]) {
  test(`rendered ${name} fails`, () => {
    assert.throws(() => validateRenderedBlogDocument(validHtml.replace(from, to), fixture, "en"), expected);
  });
}
