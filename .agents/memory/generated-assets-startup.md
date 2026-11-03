---
name: Generated assets at development startup
description: Why ignored assets required by the development server need explicit startup generation.
---

Invoke required asset generation explicitly in the development command rather than relying on an arbitrary pre/post lifecycle hook.

**Why:** pnpm's handling of arbitrary lifecycle hooks depends on configuration. A hook running in one workspace does not establish that fresh checkouts will run it, and ignored generated assets are absent there.

**How to apply:** When the development UI references ignored generated files, test startup with those derivatives absent. Confirm the configured development command recreates them before serving the app; keep originals untouched.
