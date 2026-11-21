/**
 * Regenerates the per-article <url> blocks in public/sitemap.xml from the
 * live article inventory in src/data/blog-articles.ts.
 *
 * Why this exists:
 *   The blog article sitemap entries used to be hand-maintained, which let
 *   the sitemap drift out of sync with the real article list (stale slugs,
 *   missing new articles, missing hreflang alternates). This script derives
 *   the article inventory straight from the source of truth so the sitemap
 *   can never drift again — run it whenever blog-articles.ts changes (it
 *   also runs automatically as part of `pnpm run build`).
 *
 * How it works:
 *   1. Parse ARTICLES out of blog-articles.ts using brace-balanced object
 *      extraction (same technique as scripts/prerender.mjs) to avoid
 *      needing a TS loader for a plain Node script.
 *   2. Remove every existing per-article blog <url> block from sitemap.xml
 *      (index pages /blog and /блог are left untouched).
 *   3. Insert a freshly generated RU+EN <url> pair for every article right
 *      after the /blog index block.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_SRC_PATH = path.join(ROOT, "src", "data", "blog-articles.ts");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");

const SITE_URL = "https://comfortline.by";
const BLOG_BASE_RU = "/блог";
const BLOG_BASE_EN = "/blog";

export function extractArticles(src) {
  const startMarker = "export const ARTICLES: Article[] = [";
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error("Could not find `export const ARTICLES: Article[] = [` in blog-articles.ts");
  }
  const arrStart = startIdx + startMarker.length - 1; // index of the opening '['

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
  if (arrEnd === -1) throw new Error("Unbalanced ARTICLES array literal");

  const arrayBody = src.slice(arrStart + 1, arrEnd);

  const articles = [];
  let i = 0;
  while (i < arrayBody.length) {
    if (arrayBody[i] === "{") {
      let objDepth = 0;
      const start = i;
      for (; i < arrayBody.length; i++) {
        if (arrayBody[i] === "{") objDepth++;
        else if (arrayBody[i] === "}") {
          objDepth--;
          if (objDepth === 0) {
            i++;
            break;
          }
        }
      }
      const objStr = arrayBody.slice(start, i);
      const slug = /(?<!\w)slug:\s*"([^"]+)"/.exec(objStr)?.[1];
      const slugEn = /slugEn:\s*"([^"]+)"/.exec(objStr)?.[1];
      const dateISO = /dateISO:\s*"([^"]+)"/.exec(objStr)?.[1];
      const dateModified = /dateModified:\s*"([^"]+)"/.exec(objStr)?.[1];
      if (slug) articles.push({ slug, slugEn, dateISO, dateModified });
    } else {
      i++;
    }
  }
  return articles;
}

function buildArticleUrlBlocks(article) {
  if (!article.slugEn) {
    // No English translation yet — skip rather than emitting a broken alternate.
    return "";
  }
  const ruLoc = `${SITE_URL}${encodeURI(`${BLOG_BASE_RU}/${article.slug}`)}`;
  const enLoc = `${SITE_URL}${BLOG_BASE_EN}/${article.slugEn}`;
  const lastmod = article.dateModified || article.dateISO;
  if (!lastmod) throw new Error(`Missing article date: ${article.slug}`);

  const block = (loc) => `  <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
      <xhtml:link rel="alternate" hreflang="ru" href="${ruLoc}"/>
      <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${ruLoc}"/>
    </url>`;

  return `${block(ruLoc)}\n${block(enLoc)}`;
}

function isPerArticleBlogBlock(block) {
  const locMatch = /<loc>([^<]+)<\/loc>/.exec(block);
  if (!locMatch) return false;
  const loc = locMatch[1];
  // Index pages end in exactly /blog or /%D0%B1%D0%BB%D0%BE%D0%B3 (no trailing slug).
  // Per-article pages have a slug segment after the blog base.
  return /\/blog\/[^/]+$/.test(loc) || /\/%D0%B1%D0%BB%D0%BE%D0%B3\/[^/]+$/.test(loc);
}

export function regenerateSitemap(sitemapXml, articles) {
  const blockRegex = /  <url>[\s\S]*?<\/url>/g;
  const blocks = sitemapXml.match(blockRegex) || [];

  const keptBlocks = [];
  let blogIndexEnEnd = -1;

  for (const block of blocks) {
    if (isPerArticleBlogBlock(block)) continue; // drop stale/auto-managed article entries
    keptBlocks.push(block);
    if (/<loc>https:\/\/comfortline\.by\/blog<\/loc>/.test(block)) {
      blogIndexEnEnd = keptBlocks.length; // insert right after this block
    }
  }

  if (blogIndexEnEnd === -1) {
    throw new Error("Could not find the /blog index <url> block in sitemap.xml");
  }

  const newArticleBlocks = articles
    .map(buildArticleUrlBlocks)
    .filter(Boolean);

  keptBlocks.splice(blogIndexEnEnd, 0, ...newArticleBlocks);

  // Rebuild the file: replace the region from the first original block to the
  // last with the newline-joined kept+inserted blocks, preserving header/footer.
  const firstBlockIdx = sitemapXml.indexOf(blocks[0]);
  const lastBlock = blocks[blocks.length - 1];
  const lastBlockIdx = sitemapXml.lastIndexOf(lastBlock) + lastBlock.length;

  const header = sitemapXml.slice(0, firstBlockIdx);
  const footer = sitemapXml.slice(lastBlockIdx);

  return header + keptBlocks.join("\n") + footer;
}

// Add exactly the route pairs actually registered in the client/SSR route table.
// Keep older sitemap entries intact; this section is safe to rerun on every build.
function regenerateCityRouteSitemap(xml, pages) {
  const pairList = [
    ...pages.map((page) => [page.pathRu, page.pathEn]),
    ["/трансферы-по-городам-беларуси", "/belarus-city-transfers"],
  ];
  const urls = new Set(pairList.flat().map((p) => SITE_URL + encodeURI(p)));
  const kept = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
    return urls.has(loc) ? "" : block;
  });
  const blocks = pairList.flatMap(([pathRu, pathEn]) => {
    const ru = SITE_URL + encodeURI(pathRu);
    const en = SITE_URL + encodeURI(pathEn);
    const entry = (url) =>
      "  <url>\n" +
      "    <loc>" + url + "</loc>\n" +
      "    <lastmod>2026-11-21</lastmod>\n" +
      "    <changefreq>monthly</changefreq>\n" +
      "    <priority>0.7</priority>\n" +
      "    <xhtml:link rel=\"alternate\" hreflang=\"ru\" href=\"" + ru + "\"/>\n" +
      "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"" + en + "\"/>\n" +
      "    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" + ru + "\"/>\n" +
      "  </url>";
    return [entry(ru), entry(en)];
  });
  if (!kept.includes("</urlset>")) throw new Error("Missing sitemap closing tag");
  return kept.replace(/\s*<\/urlset>/, "\n" + blocks.join("\n") + "\n</urlset>");
}

function main() {
  const src = fs.readFileSync(ARTICLES_SRC_PATH, "utf8");
  const articles = extractArticles(src);
  if (articles.length === 0) throw new Error("No articles parsed from blog-articles.ts");

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const blogUpdated = regenerateSitemap(sitemapXml, articles);
  const cityPages = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/belarus-city-route-pages.json"), "utf8"));
  const updated = regenerateCityRouteSitemap(blogUpdated, cityPages);
  fs.writeFileSync(SITEMAP_PATH, updated, "utf8");

  process.stdout.write(
    `generate-blog-sitemap: wrote ${articles.length} article pairs to public/sitemap.xml\n`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
