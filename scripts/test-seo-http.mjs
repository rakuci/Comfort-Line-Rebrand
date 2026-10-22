/**
 * Exercise production HTTP behaviour against the freshly prerendered local site.
 * Run from repository root after vite build + scripts/prerender.mjs.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const port = 29000 + Math.floor(Math.random() * 24000);
const url = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server.mjs"], {
  cwd: resolve("artifacts/comfortline-website"),
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
child.stdout.on("data", (data) => { output += data.toString(); });
child.stderr.on("data", (data) => { output += data.toString(); });

try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error("Server exited unexpectedly: " + output);
    try {
      const r = await fetch(url + "/robots.txt", { signal: AbortSignal.timeout(1000) });
      if (r.status === 200) { ready = true; break; }
    } catch { /* server starting */ }
    await sleep(200);
  }
  assert(ready, "Production server failed to start: " + output);

  const robots = await fetch(url + "/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("cache-control") || "", /must-revalidate/);
  assert.doesNotMatch(robots.headers.get("cache-control") || "", /immutable/);
  assert.match(await robots.text(), /Sitemap: https:\/\/comfortline\.by\/sitemap\.xml/);

  const sitemap = await fetch(url + "/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("cache-control") || "", /must-revalidate/);
  assert.doesNotMatch(sitemap.headers.get("cache-control") || "", /immutable/);

  const rss = await fetch(url + "/feed.xml");
  assert.equal(rss.status, 200);
  assert.match(rss.headers.get("x-robots-tag") || "", /noindex/);

  for (const path of ["/nonexistent-seo-test-2026", "/https://www.instagram.com/fake"]) {
    const missing = await fetch(url + path);
    assert.equal(missing.status, 404, "Expected real 404 on " + path);
    assert.match(missing.headers.get("x-robots-tag") || "", /noindex/);
  }

  const route = "/трансфер-минск-краков";
  const page = await fetch(url + encodeURI(route));
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /rel="canonical"/);
  assert.match(html, /<h1\b/i);

  const redirect = await fetch(url + encodeURI(route) + "/", { redirect: "manual" });
  assert.equal(redirect.status, 301);
  assert.equal(decodeURI(redirect.headers.get("location") || ""), route);

  // Old ?lang=en links found by Google must resolve to the current
  // language-specific URLs, without creating additional indexable duplicates.
  const legacyLanguageCases = [
    ["/?lang=en", "/en"],
    ["/faq?lang=en", "/en/faq"],
    ["/terms?lang=en", "/en/terms"],
    ["/privacy?lang=en", "/en/privacy"],
    ["/faq/?lang=en", "/en/faq"],
    ["/faq?lang=ru", "/faq"],
    ["/faq?lang=en&utm_source=google", "/en/faq?utm_source=google"],
  ];
  for (const [requested, expectedLocation] of legacyLanguageCases) {
    const response = await fetch(url + requested, { redirect: "manual" });
    assert.equal(response.status, 301, "Expected permanent language redirect: " + requested);
    assert.equal(response.headers.get("location"), expectedLocation, "Unexpected redirect: " + requested);
  }

  const blogQuery = await fetch(url + "/blog?q=%7Bsearch_term_string%7D");
  assert.equal(blogQuery.status, 200, "Blog query parameters must not be redirected to language routes");

  console.log("PASS: robots/sitemap freshness, RSS and 404 noindex, route 200, canonical and language 301");
} finally {
  child.kill("SIGTERM");
}
