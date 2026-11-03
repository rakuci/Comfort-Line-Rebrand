import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { createDataLoader } from "../lib/load-blog-data.mjs";
import { generateBlogFeed } from "../generate-blog-feed.mjs";

const { ARTICLES } = createDataLoader()("blog-articles");
const modifiedNS = "http://purl.org/dc/terms/";

function validateFeed(xml, articles) {
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  try {
    const doc = dom.window.document;
    assert.equal(doc.documentElement.tagName, "rss");
    assert.equal(doc.documentElement.getAttribute("version"), "2.0");
    const text = (node, tag) => {
      const nodes = node.getElementsByTagName(tag);
      assert.equal(nodes.length, 1, `Exactly one ${tag} required`);
      return nodes[0].textContent;
    };
    const channel = doc.querySelector("channel");
    assert.equal(text(channel, "language"), "ru");
    assert.equal(channel.querySelector(":scope > link").textContent,
      "https://comfortline.by/%D0%B1%D0%BB%D0%BE%D0%B3");
    const items = [...channel.querySelectorAll("item")];
    assert.equal(items.length, articles.length, "Complete article coverage");
    const urls = items.map((item) => text(item, "link"));
    assert.equal(new Set(urls).size, urls.length, "No duplicate items");
    let previous = "9999-12-31";
    for (const item of items) {
      const article = articles.find((a) =>
        new URL(`/блог/${a.slug}`, "https://comfortline.by").href === text(item, "link"));
      assert.ok(article, "Canonical article URL must exist, without trailing slash");
      assert.equal(text(item, "guid"), text(item, "link"));
      assert.equal(item.querySelector("guid").getAttribute("isPermaLink"), "true");
      assert.equal(text(item, "title"), article.title);
      assert.equal(text(item, "description"), article.description);
      assert.equal(text(item, "category"), article.category);
      assert.equal(Date.parse(text(item, "pubDate")), Date.parse(article.dateISO));
      const date = article.dateModified ?? article.dateISO;
      const modified = item.getElementsByTagNameNS(modifiedNS, "modified");
      assert.equal(modified.length, 1);
      assert.equal(modified[0].textContent, `${date}T00:00:00Z`);
      assert.ok(date <= previous, "Latest editorial updates first");
      previous = date;
    }
    const latest = articles.map((a) => a.dateModified ?? a.dateISO).sort().at(-1);
    assert.equal(Date.parse(text(channel, "lastBuildDate")), Date.parse(latest));
    const self = channel.getElementsByTagNameNS("http://www.w3.org/2005/Atom", "link");
    assert.equal(self.length, 1);
    assert.equal(self[0].getAttribute("href"), "https://comfortline.by/feed.xml");
  } finally {
    dom.window.close();
  }
}

test("checked-in RSS covers every article with current page metadata", () => {
  const xml = readFileSync(new URL("../../public/feed.xml", import.meta.url), "utf8");
  validateFeed(xml, ARTICLES);
  assert.equal(xml, generateBlogFeed(ARTICLES));
  const checkpoint = ARTICLES.find((a) => a.slug === "какой-кпп-выбрать");
  assert.match(checkpoint.description, /Котловка закрыта/);
  assert.match(checkpoint.descriptionEn, /Kotlovka is closed/);
});

test("feed reflects new articles and revised summaries without a maintained list", () => {
  const articles = [...ARTICLES, {
    ...ARTICLES[0], slug: "future-article", title: 'Travel & "border" <guide>',
    description: "Current & safe <summary>", dateISO: "2026-11-01", dateModified: "2026-11-02",
  }];
  validateFeed(generateBlogFeed(articles), articles);
  assert.deepEqual(articles.slice(0, -1), ARTICLES, "Generator must not sort source in place");
});

test("parity validation rejects omissions, duplicates, stale metadata, URLs and dates", () => {
  const xml = generateBlogFeed(ARTICLES);
  const mutations = [
    (s) => s.replace(/    <item>[\s\S]*?<\/item>\n/, ""),
    (s) => s.replace("</channel>", `${s.match(/<item>[\s\S]*?<\/item>/)[0]}</channel>`),
    (s) => s.replace(/(<item>\s*)<title>[^<]+<\/title>/, "$1<title>Old title</title>"),
    (s) => s.replace(/<description>[^<]+<\/description>(?=\n    <\/item>)/, "<description>Old summary</description>"),
    (s) => s.replace(/(<link>https:\/\/comfortline.by\/[^<]+)(<\/link>)/, "$1/$2"),
    (s) => s.replace(/<pubDate>[^<]+<\/pubDate>/, "<pubDate>Sun, 01 Mar 2026 00:00:00 GMT</pubDate>"),
    (s) => s.replace(/<dcterms:modified>[^<]+<\/dcterms:modified>/, "<dcterms:modified>2026-01-01T00:00:00Z</dcterms:modified>"),
    (s) => s.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, "<lastBuildDate>Sun, 03 May 2026 00:00:00 GMT</lastBuildDate>"),
  ];
  for (const [index, mutate] of mutations.entries()) {
    assert.notEqual(mutate(xml), xml, `Mutation ${index} must change the feed`);
    assert.throws(() => validateFeed(mutate(xml), ARTICLES), `Mutation ${index} must fail`);
  }
  assert.throws(() => validateFeed("<rss>&broken;</rss>", ARTICLES));
});

test("generator fails explicitly on incomplete, duplicate or invalid article data", () => {
  for (const patch of [{ title: "" }, { dateISO: "2026-02-30" }, { dateModified: "2020-01-01" }]) {
    assert.throws(() => generateBlogFeed([{ ...ARTICLES[0], ...patch }]));
  }
  assert.throws(() => generateBlogFeed([]));
  assert.throws(() => generateBlogFeed([ARTICLES[0], ARTICLES[0]]));
});
