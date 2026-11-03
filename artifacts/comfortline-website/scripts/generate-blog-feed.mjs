import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDataLoader } from "./lib/load-blog-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://comfortline.by";
const xml = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);

function timestamp(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid article date: ${date}`);
  }
  return new Date(date).toUTCString();
}

// The advertised feed is Russian. Include the entire published inventory, newest
// editorial update first; GUIDs and pubDate stay stable when an article changes.
export function generateBlogFeed(articles, blogBase = "/блог") {
  if (!articles.length) throw new Error("Cannot generate an empty article feed");
  const seen = new Set();
  for (const article of articles) {
    for (const field of ["slug", "title", "description", "category", "dateISO"]) {
      if (typeof article[field] !== "string" || !article[field].trim()) {
        throw new Error(`Missing ${field} for feed article ${article.slug}`);
      }
    }
    timestamp(article.dateISO);
    timestamp(article.dateModified ?? article.dateISO);
    if (article.dateModified && article.dateModified < article.dateISO) {
      throw new Error(`Modification predates publication: ${article.slug}`);
    }
    if (seen.has(article.slug)) throw new Error(`Duplicate feed slug: ${article.slug}`);
    seen.add(article.slug);
  }
  const updated = (article) => article.dateModified ?? article.dateISO;
  const sorted = [...articles].sort((a, b) =>
    updated(b).localeCompare(updated(a)) || b.dateISO.localeCompare(a.dateISO) ||
    a.slug.localeCompare(b.slug, "ru"));
  const items = sorted.map((article) => {
    const url = new URL(`${blogBase}/${article.slug}`, origin).href;
    return `    <item>
      <title>${xml(article.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${timestamp(article.dateISO)}</pubDate>
      <dcterms:modified>${updated(article)}T00:00:00Z</dcterms:modified>
      <category>${xml(article.category)}</category>
      <description>${xml(article.description)}</description>
    </item>`;
  }).join("\n\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dcterms="http://purl.org/dc/terms/">
  <channel>
    <title>ComfortLine — блог о трансферах из Беларуси</title>
    <link>${xml(new URL(blogBase, origin).href)}</link>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Гайды, лайфхаки и аналитика о трансферах из Минска в аэропорты ЕС, прохождении границы Беларусь–Литва и поездках по Европе. Опыт водителей ComfortLine с 2015 года.</description>
    <language>ru</language>
    <copyright>© ComfortLine</copyright>
    <lastBuildDate>${timestamp(updated(sorted[0]))}</lastBuildDate>
    <ttl>1440</ttl>
    <image>
      <url>${origin}/favicon-512.png</url>
      <title>ComfortLine</title>
      <link>${origin}/</link>
    </image>

${items}
  </channel>
</rss>
`;
}

function main() {
  const { ARTICLES, BLOG_BASE_RU } = createDataLoader()("blog-articles");
  const feed = generateBlogFeed(ARTICLES, BLOG_BASE_RU);
  const target = resolve(root, "public/feed.xml");
  if (process.argv.includes("--check")) {
    if (readFileSync(target, "utf8") !== feed) {
      throw new Error("public/feed.xml is stale. Run pnpm run feed:blog.");
    }
    console.log(`blog-feed: ${ARTICLES.length} articles match current source data.`);
  } else {
    writeFileSync(target, feed);
    console.log(`blog-feed: wrote ${ARTICLES.length} articles to public/feed.xml.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
