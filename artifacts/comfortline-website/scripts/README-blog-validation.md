# Offline bilingual blog checks

## RSS feed

`pnpm run feed:blog` regenerates `public/feed.xml` from the real article data.
The existing Russian feed includes every published article, ordered by latest
editorial date (publication date and slug break ties). Titles, summaries and
categories use the Russian page fields, and links/GUIDs use canonical URLs
without trailing slashes. `pubDate` preserves publication; `dcterms:modified`
records the latest editorial date. `lastBuildDate` is the latest editorial date,
not the build clock. The build generates the feed before validation and bundling.

`pnpm run check:blog:feed` runs offline XML/parity mutation tests and compares
the checked-in feed with current source data **without repairing it**. It needs
no build output, server or network. This also runs in `check:blog:discovery`.

Run from `artifacts/comfortline-website`:

- `pnpm run check:blog:source` — checks actual TypeScript article data, policy
  expectations and validator mutation tests. No built files required.
- `pnpm run check:blog` — also checks **all generated RU/EN blog pages** in
  `dist/public`. Missing output fails explicitly; run a build first.
- `node scripts/check-blog-content.mjs --rendered` — just the rendered-page
  checks, useful after prerendering.

`pnpm run build` runs source checks before bundling. `scripts/prerender.mjs`
always checks generated blog HTML before succeeding, including when run
directly. Failed checks stop the build before its existing IndexNow step.
The checks themselves do not use the network or submit anything.
Prerendering requires a fresh Vite template with an empty `#root`. Re-running
it on previously prerendered homepage output fails with an explicit message
instead of copying homepage metadata/content into article routes.

For a local production-render pass without the existing network-facing
IndexNow submission:

```sh
pnpm run check:blog:source
pnpm exec vite build --config vite.config.ts
node scripts/prerender.mjs
```

## Updating policy deliberately

`fixtures/blog-policy-expectations.mjs` pins article identities, required
localized guide links, checkpoint vehicle restrictions and the separate land
and airport visa regimes. Its visa/checkpoint baseline is the **16 October
2026 editorial inspection** of the official sources already linked in the
articles. Customs checks retain their separate 17 October review. These are
not legal rulings, travel-day confirmations or proof a source is still current.

When an official update changes a rule:

1. Read the current primary source and record its publication/effective dates
   and the date of editorial inspection beside the article's source.
2. Update both translations, other affected articles and checker rules.
3. Intentionally update the relevant dated expectations and explanatory
   comments. Do not copy the new guide into the tests as legal authority or
   loosen assertions merely to make them pass.
4. Run source checks, regenerate the pages, and run rendered checks.

The validator's negative tests prove that shared bilingual errors, a broken
localized link, missing translations, altered publication identities, changed
visa counts/cutoffs, wrong canonicals/hreflang and incomplete prerendered
content fail. Rendered checks use jsdom without scripts or resource loading;
no browser or running server is required.

## Separate sitemap and social-preview regression checks

These checks are independent of the HTML canonical/hreflang and border-policy
suite above. From `artifacts/comfortline-website`, run:

```sh
pnpm run check:blog:discovery
```

This offline command runs mutation tests, checks the **existing**
`public/sitemap.xml` (it does not repair it), and compares the route parser and
OG generator's pure image plan against real TypeScript article data and the
preserved publication/social identities. It checks every RU/EN URL and
reciprocal ru/en/x-default alternate, rejects missing/duplicate/orphan article
entries, and requires `lastmod = dateModified || dateISO` — never build time.
Both image filenames and title/subtitle languages are checked. Unit tests do
not generate images, start a browser/server, contact search engines, or fetch
network resources.

To check actual built artifacts, including all 28 article JPEGs (format and
1200×630 dimensions), OG/secure/Twitter image targets, `og:url`, share dates
and Article schema image targets:

```sh
pnpm run check:blog:discovery:generated
```

Missing built files fail; there is no silent skip or default-image fallback.
The generated check also runs `pnpm run check:blog:client`: a jsdom integration
test mounts the real blog pages, language provider and SEO effects (with
unrelated layout/widgets stubbed). It checks every RU/EN blog URL before and
after hydration, then keeps the client mounted through article navigation and
language changes. OG, secure OG, Twitter and Article schema images must match
existing generated files; stale Article schemas must not survive navigation.
This test needs fresh built output but does not use a browser or network.
This command reads `dist/public/sitemap.xml` as well as the source sitemap.
To prepare fresh output **without IndexNow or other network submission**:

```sh
pnpm run sitemap:blog
pnpm run check:blog:discovery
pnpm exec vite build --config vite.config.ts
pnpm run og
node scripts/prerender.mjs
pnpm run check:blog:discovery:generated
```

Only the explicit `og` generation step renders images. Re-running either
checker never regenerates images or rewrites outputs. Normal `build` runs
both discovery commands before its existing IndexNow step.

### Transfer, fleet and blog-index share previews

The same discovery commands also protect every localized transfer route
(including country and Europe overviews), fleet detail page and blog index.
An independent TypeScript AST reader reads the actual TSX copy and SEO paths,
separately from the manifest's regex parser. It checks each manifest route
and the **full** OG generator plan, including filename collisions and silent
deduplication, against those expectations. English/Russian filenames, titles
and truncated subtitles must agree with the source. Fleet image identities
use their vehicle keys, not necessarily their English URL slugs.

The generated check reads each expected JPEG and requires JPEG format and
1200×630 dimensions. Each built head must have exactly one correct localized
`og:url`, `og:image`, `og:image:secure_url` and `twitter:image`, plus matching
locale, website type, dimensions, MIME type and large-image Twitter card.
Missing output, default-image fallback, stale or wrong-language targets and
duplicate tags fail. Direct prerendering runs these non-article output checks
too; a fallback image cannot silently pass prerendering.

`scripts/tests/non-article-discovery-validation.test.mjs` covers transfer,
airport, country, Europe overview, bespoke V-Class, mapped fleet and blog
index representatives. Negative cases include shared parser/plan drift,
deduped images, missing/corrupt JPEGs, wrong dimensions/format, missing HTML,
and bad OG/Twitter tags in both languages. Image metadata tests reuse static
committed JPEG bytes with edited headers; unit tests never render images.
These are built-output checks, not client hydration/navigation or page-body
SSR checks.

### Mutation proof

The unit command includes negative cases for a localized `<loc>` switched to
RU, stale slugs, nonreciprocal alternates, stale/build-day modification dates,
wrong-language image filenames/overlays, and stale OG/Twitter/schema targets.
For manual verification on disposable output, change an English article
`<loc>` or `lastmod` in `public/sitemap.xml` and run
`pnpm run check:blog:discovery`: it must exit nonzero. Restore with
`pnpm run sitemap:blog`. After building, change an article's `og:image` or
`twitter:image` in its `dist/public/blog/<slug>/index.html`, or remove its
`dist/public/og/<ogSlug>-en.jpg`, and run
`pnpm run check:blog:discovery:generated`: it must exit nonzero. Restore built
files with the offline preparation sequence above. Do not run regeneration
before a mutation check; doing so would repair the defect being tested.
