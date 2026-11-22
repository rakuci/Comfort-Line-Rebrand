"""Exercise rendered fares against a different daily exchange rate in real Chrome."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import which
from threading import Thread

from playwright.sync_api import sync_playwright

dist = Path(__file__).resolve().parents[1] / "dist" / "public"
handler = partial(SimpleHTTPRequestHandler, directory=str(dist))
with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as playwright:
    Thread(target=server.serve_forever, daemon=True).start()
    browser = playwright.chromium.launch(executable_path=which("google-chrome") or which("chromium"))
    try:
        for width in (320, 390, 768, 1440):
            page = browser.new_page(viewport={"width": width, "height": 850})
            page.route("**/api/eur-rate", lambda route: route.fulfill(json={
                "date": "2099-01-01", "bynPerEur": 3.4,
            }))
            for slug, euros, byn in [
                ("warsaw-transfer", 399, 1360),
                ("minsk-krakow-transfer", 699, 2380),
                ("трансфер-минск-вильнюс-аэропорт", 249, 850),
            ]:
                # Use the canonical path even though the local file server serves directories.
                def serve_page(route):
                    route.fulfill(path=dist / slug / "index.html", content_type="text/html")
                url = f"http://127.0.0.1:{server.server_port}/{slug}"
                page.route("**/*", lambda route: serve_page(route) if route.request.is_navigation_request() else route.fallback())
                page.goto(url, wait_until="domcontentloaded")
                cell = page.locator("table").first.locator("tbody td").first
                page.wait_for_function("""expected => {
                    const cell = document.querySelector('table tbody td');
                    return cell?.innerText.replace(/[,\\s]/g, '').includes(expected + 'BYN');
                }""", arg=str(byn))
                assert f"€{euros}" in cell.inner_text()
                assert page.locator("table").first.evaluate("""t =>
                    t.getBoundingClientRect().right <= innerWidth &&
                    [...t.querySelectorAll('td,th')].every(c => c.scrollWidth <= c.clientWidth + 1)
                """), (width, slug)
                if slug.startswith("трансфер"):
                    assert "850 BYN" in page.locator("table").nth(1).inner_text()
                page.unroute("**/*")
            page.close()
            print(f"Fare conversion and table layout passed at {width}px")
    finally:
        browser.close()
        server.shutdown()
