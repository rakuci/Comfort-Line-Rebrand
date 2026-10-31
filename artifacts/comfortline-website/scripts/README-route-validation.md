# Offline transfer-page rendering checks

From `artifacts/comfortline-website`:

```sh
pnpm run check:routes
pnpm exec vite build --config vite.config.ts
node scripts/prerender.mjs
```

These commands do not require a browser, running app, or external network.
`check:routes` runs before bundling in the normal production build. It includes
negative checks for transfer, airport, country, vehicle and Europe overview
pages in both languages, plus subprocess checks proving a thrown component
stops production rendering with its path and original cause. Subprocess output
is isolated in temporary directories, never the real production folder.

Prerendering always uses the actual eagerly imported components from
`src/ssr-entry.tsx`. Any route that throws or returns empty output fails:
there is no synthetic summary fallback. The Vite loader and jsdom window close
on failure as well as success.

Before writing each localized transfer/airport/country/vehicle/overview page,
the generated document must have its route-specific H1, multiple body sections,
and the original hero copy where exposed by the manifest. Its title, description,
document language, canonical and reciprocal RU/EN/x-default links must match
the route manifest. These are content-presence checks, not independent legal
or border-policy assertions. Existing bilingual blog checks remain separate.

A fresh Vite build is required before rerunning prerendering: previously
prerendered homepage HTML is not a reusable template. The commands above omit
the normal build's existing IndexNow submission and image generation steps.
Share-preview checks are outside this suite.
