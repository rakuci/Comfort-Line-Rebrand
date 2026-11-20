import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

// Marketing pages must not show the amber regulatory warning.
// It is reserved for editorial blog articles which explicitly opt in.
const pages = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/pages");

function visit(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) return visit(file);
    return entry.name.endsWith(".tsx") ? [file] : [];
  });
}

test("regulatory disclaimer banner appears only in blog article templates", () => {
  const usages = visit(pages)
    .filter((file) => /<DisclaimerBanner\\b/.test(readFileSync(file, "utf8")))
    .map((file) => relative(pages, file).replaceAll("\\\\", "/"))
    .sort();
  assert.deepEqual(usages, ["blog/article.tsx"],
    "Warning banner must never render on transfer, airport, FAQ, directory, or other service pages");
  const article = readFileSync(join(pages, "blog/article.tsx"), "utf8");
  assert.match(article, /article\\.disclaimerBanner\\s*&&\\s*<DisclaimerBanner\\s*\\/>/,
    "Blog article warning must still depend on the article's explicit opt-in");
});

test("commercial route templates preserve official sources without showing warning banners", () => {
  for (const name of ["route-landing-page.tsx", "country-transfer-page.tsx"]) {
    const contents = readFileSync(join(pages, name), "utf8");
    assert.doesNotMatch(contents, /<DisclaimerBanner\\b/);
    assert.match(contents, /showOfficialSources/,
      name + " should keep border source links as normal page content");
    assert.match(contents, /id="official-sources"/,
      name + " should retain the official references section");
  }
  const airportPages = ["minsk-kaunas-airport.tsx", "minsk-riga-airport.tsx", "minsk-warsaw-airport.tsx"];
  for (const file of airportPages) {
    assert.match(readFileSync(join(pages, file), "utf8"), /<BorderOfficialSources\\b/,
      file + " should retain its useful border references");
  }
});
