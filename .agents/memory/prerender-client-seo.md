---
name: Prerender and client SEO
description: Why metadata checks must cover both generated HTML and client transitions.
---

Treat generated HTML and client-updated metadata as separate verification targets.
Keep a mounted client across route and language changes; a fresh render per URL
cannot expose stale metadata left by the previous page.

**Why:** Correct generated blog images concealed missing filenames supplied by
client effects. Prerendered page-specific structured data also survived beside
the client schema, so even a correct replacement image did not remove the stale
one. Static discovery checks alone could not catch either failure.

**How to apply:** For metadata changes, seed checks with actual generated head
markup, then run real SEO effects through hydration and navigation. Assert all
image-bearing tags and schemas, including their absence when leaving an article.
Use jsdom for head-only checks rather than an expensive browser run.

Social-image text plans and filenames do not establish visual correctness.
Keep layout regression tests pure, and inspect the generated raster images
separately with the actual build font fallback.

**Why:** Localized transfer copy can pass identity and dimension checks while
extending outside the image canvas; font substitutions can change its width.

**How to apply:** When changing share-image copy or layout, cover long Russian
and English examples, horizontal bounds, and separation from branding/footer.
Verify actual generated previews as well as the layout model.
