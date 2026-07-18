from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, viewport in [("desktop", {"width": 1440, "height": 900}), ("mobile", {"width": 390, "height": 844})]:
        page = browser.new_page(viewport=viewport)
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.route("**/api/create-preference", lambda route: route.fulfill(status=200, content_type="application/json", body='{"init_point":"https://example.com/checkout"}'))
        page.goto("http://127.0.0.1:4889", wait_until="networkidle")
        print("BOOT", name, page.title(), page.locator("body").inner_text()[:120])
        page.locator("h1").wait_for()
        page.get_by_text("Multicontas por QR").wait_for()
        page.get_by_text("Automações úteis").wait_for()
        page.get_by_text("Pipeline CRM", exact=True).first.wait_for()
        page.get_by_role("button", name="Existe garantia contra bloqueio?").click()
        page.get_by_text("Nenhuma ferramenta séria pode oferecer essa garantia.").wait_for()
        overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        assert not overflow, f"horizontal overflow on {name}"
        assert not errors, errors
        page.screenshot(path=f"tests/landing-{name}.png", full_page=True)
        page.close()
    checkout = browser.new_page()
    checkout.route("**/api/create-preference", lambda route: route.fulfill(status=200, content_type="application/json", body='{"init_point":"https://example.com/checkout"}'))
    checkout.goto("http://127.0.0.1:4889", wait_until="networkidle")
    checkout.get_by_role("button", name="Quero o Zap Mágico →").click()
    checkout.wait_for_url("https://example.com/checkout")
    print("QA_OK landing desktop mobile checkout")
    browser.close()
