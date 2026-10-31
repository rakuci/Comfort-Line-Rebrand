# Build-only share-image fonts

Pinned, unmodified **DejaVu Sans 2.37**, Book (400) and Bold (700).
These match the previous renderer's DejaVu fallback, cover Russian and English,
and are not loaded by the website or copied into its public assets.

Upstream: https://dejavu-fonts.github.io/ (release `version_2_37`,
https://github.com/dejavu-fonts/dejavu-fonts/releases/tag/version_2_37).
The vendored TTFs were taken from Debian's `fonts-dejavu-core` 2.37 package.
Redistribution is permitted by the included `LICENSE.txt` (Bitstream Vera
license; DejaVu changes are public domain). Do not replace with host font paths.
SHA-256 pins live in `../lib/og-fonts.mjs` and are verified on every generation.

`fonts.conf` searches **only this directory**, with no system configuration
includes. `configureOgFonts()` sets `FONTCONFIG_FILE` and `FONTCONFIG_PATH`
before sharp/librsvg is imported, overriding inherited host settings. The
relative font directory is relative to the config file, not the working
directory. Fontconfig may write a disposable cache under `XDG_CACHE_HOME`;
no populated cache or network download is required. Keep generation in its own
Node process; do not import sharp before configuring these fonts.

SVGs request exactly `DejaVu Sans`, with 400 or 700 weights (no synthetic
semibold/extrabold or generic fallback stack). Layout estimates remain
conservative; this does not alter localized copy or output paths.

Run `pnpm run check:og:fonts` for checksum, glyph coverage, weight selection,
and fresh-process rendering tests. The optional native font-selection assertion
uses `fc-match` when installed; rendering and glyph coverage tests need only
Node and the project's existing sharp dependency.

The pin makes font selection deterministic, not every native renderer version:
JPEG/pixel hashes are compared between clean processes on the same toolchain,
not promised across upgrades of sharp/libvips/librsvg/FreeType.
