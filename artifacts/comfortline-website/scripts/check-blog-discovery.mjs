import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDataLoader } from "./lib/load-blog-data.mjs";
import { collectAllRoutes } from "./route-manifest.mjs";
import { planOgImages } from "./og-images.mjs";
import {
  validateDiscoveryIdentities, validateBlogSitemap, validateBlogImagePlan,
  validateGeneratedBlogDiscovery,
} from "./lib/blog-discovery-validation.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
try {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--generated") || args.length > 1) {
    throw new Error("Usage: node scripts/check-blog-discovery.mjs [--generated]");
  }
  const { ARTICLES } = createDataLoader()("blog-articles");
  validateDiscoveryIdentities(ARTICLES);
  const { blogArticleRoutes } = collectAllRoutes();
  validateBlogImagePlan(ARTICLES, blogArticleRoutes, planOgImages(blogArticleRoutes));
  validateBlogSitemap(readFileSync(resolve(root, "public/sitemap.xml"), "utf8"), ARTICLES);
  if (args.includes("--generated")) {
    await validateGeneratedBlogDiscovery(ARTICLES, resolve(root, "dist/public"));
  }
  console.log(`[blog-discovery] Passed ${ARTICLES.length} article pairs: XML URLs/alternates/dates, localized share plans${args.length ? ", built sitemap, JPEGs and social metadata" : ""}. Offline; no images regenerated.`);
} catch (error) {
  console.error(`[blog-discovery] FAILED: ${error.message}`);
  process.exitCode = 1;
}
