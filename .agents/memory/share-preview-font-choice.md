---
name: Share-preview font choice
description: Why deterministic share-preview typography uses the previous renderer's fallback rather than a new brand font.
---

Preserve the existing share-preview appearance when revisiting font choices;
the deterministic-font work was not a typography redesign.

**Why:** The SVG originally requested Arial/Helvetica but the actual renderer used
DejaVu Sans. Pinning that effective font avoids an unrelated visual/layout change
while removing reliance on installed host fonts. This choice does not imply that
DejaVu Sans should become the website's brand font.

**How to apply:** Treat a different preview font or an app-wide font migration as
a separate design decision, not a routine build-dependency cleanup.
