# SEO Strategy

## In scope
- Public marketing pages
- Service and landing pages
- Blog posts and article pages
- Static informational pages exposed to anonymous users

## Out of scope
- Authenticated dashboards (`/app/**`)
- Admin or back-office pages (`/admin/**`)
- Internal tooling and API-only packages

## Target audience
- Travelers in Belarus, especially Minsk, looking for private airport and cross-border transfers to Vilnius, Warsaw, Kaunas, Riga, and other European destinations
- Russian- and English-speaking users researching border crossings, airport logistics, fares, and transfer planning

## Primary keywords
- Minsk airport transfer
- Minsk to Vilnius airport transfer
- Minsk to Warsaw airport transfer
- Private transfer from Belarus to Lithuania or Poland
- Belarus–Lithuania border crossing guide
- Belarus–Poland border crossing guide

## Dismissed categories
- (None yet)
## Rendering and crawler assumptions
- ComfortLine is React/Vite/Wouter with production build-time static rendering of all public routes via scripts/prerender.mjs and src/ssr-entry.tsx; do not treat the production site as an empty-shell SPA.
- Public route inventory currently covers 63 bilingual route pairs (126 localized paths), including 15 blog articles. Russian and English service URLs use separate localized slugs; shared pages use /en where applicable.
- Production server.mjs serves prerendered route documents, redirects legacy URLs and trailing slashes, canonicalizes www to comfortline.by, and returns genuine 404 responses for unknown paths.
- Search, social and AI discovery are in scope; robots.txt explicitly allows public content for major AI crawlers, and llms.txt is provided.
- The mockup sandbox and internal brandbook are out of scope. Public booking and contact forms remain in scope for source-detectable accessibility.
