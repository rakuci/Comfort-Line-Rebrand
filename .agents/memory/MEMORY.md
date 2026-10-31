# Memory Index

- [Orval api-zod schemas are types only](orval-api-zod-types-only.md) — don't call `.parse()` on generated api-zod exports, they're TS interfaces not zod runtime schemas.
- [Free live-data scraping via jina.ai reader](jina-reader-scraping.md) — pattern for pulling live data from JS-rendered sites with no API/key.
- [GSC canonical/www duplicate warnings](gsc-canonical-www-duplicates.md) — correct rel=canonical tags aren't enough; www/non-www needs a real server 301, not just a meta tag.
- [GSC "alternate page with canonical" reports](gsc-canonical-alternate-page-report.md) — often stale crawl data from before a prior fix; diff sitemap vs routes before touching canonical logic.
- [Build-time TS/TSX source extraction](build-time-tsx-source-extraction.md) — regex+brace-balance parsing of .tsx source in prerender scripts; brace search must start after the full marker match, not at it.
- [jsdom and undici security overrides](jsdom-undici-compatibility.md) — upgrading undici alone can break jsdom when jsdom imports removed undici internals; upgrade jsdom with it.
- [Fleet page structured data](fleet-page-structured-data.md) — model quote-only fleet pages as services, not Vehicle products that trigger merchant-result price requirements.
- [SSR browser detection](ssr-browser-detection.md) — jsdom makes libraries detect a browser; avoid browser cache timers in the build-only rendering environment.
- [Border advice verification](border-advice-verification.md) — a dated official exception alongside a past deadline must not be treated as current permission without clarification.
- [Prerender and client SEO](prerender-client-seo.md) — static-output checks cannot prove metadata stays correct after hydration; exercise mounted effects and navigation too.
- [Share-preview font choice](share-preview-font-choice.md) — preserve the established preview appearance when revisiting build-only font choices.
