import asyncio
from playwright.async_api import async_playwright
import os
import time

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Create a new context with a larger viewport
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Mock the auth check
        await page.route("**/api/auth/me", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"id": "1", "email": "admin@cargwin.com", "role": "admin", "name": "Admin"}'
        ))

        # Mock the deals list (initial page)
        await page.route("**/api/deals/list*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"deals": [{"_id": "1", "make": "Tesla", "model": "Model 3", "year": 2023, "trim": "Performance", "msrp": 55000, "monthly_payment": 599, "is_active": true}], "total": 1, "page": 1, "limit": 10}'
        ))

        # Inject token into localStorage
        await page.add_init_script("localStorage.setItem('access_token', 'fake-token')")

        print("Navigating to Admin Featured Deals...")
        try:
            # Increase timeout for slow sandbox
            await page.goto("http://localhost:3000/admin/featured-deals", wait_until="networkidle", timeout=60000)

            # Wait for the search bar to appear
            print("Waiting for search input...")
            # Updated placeholder to match the new JSX: "Search deals (make, model, year)..."
            search_input = await page.wait_for_selector('input[placeholder*="Search deals"]', timeout=30000)

            if search_input:
                print("SUCCESS: Search bar found!")
                await page.screenshot(path="verification_featured_deals_v3.png")

                # Test pagination presence (ChevronLeft/Right icons in buttons)
                # Just check if there's a button with an svg inside the CardHeader
                pagination_buttons = await page.query_selector_all('.flex.gap-2 button')
                print(f"Found {len(pagination_buttons)} potential pagination buttons.")

                if len(pagination_buttons) >= 2:
                    print("SUCCESS: Pagination buttons found!")
                else:
                    print("WARNING: Pagination buttons NOT found as expected.")
            else:
                print("FAILURE: Search bar NOT found.")
                await page.screenshot(path="verification_failure_v3.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="verification_error_v3.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
