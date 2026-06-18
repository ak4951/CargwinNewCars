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
        mock_deals = {
            "deals": [
                {
                    "_id": "64b1f2e3c9e7a1b2c3d4e5f6",
                    "make": "Tesla",
                    "model": "Model 3",
                    "year": 2023,
                    "trim": "Standard Range",
                    "msrp": 42990,
                    "monthly_payment": 399,
                    "is_active": True
                }
            ],
            "total": 1,
            "page": 1,
            "limit": 10
        }
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
            search_input = await page.wait_for_selector('input[placeholder*="Search deals"]', timeout=30000)

            if search_input:
                print("SUCCESS: Search bar found!")
                await page.screenshot(path="verification_featured_deals.png")

                # Test pagination presence
                prev_button = await page.query_selector('button:has-text("Previous")')
                next_button = await page.query_selector('button:has-text("Next")')

                if prev_button and next_button:
                    print("SUCCESS: Pagination buttons found!")
                else:
                    print("WARNING: Pagination buttons NOT found (might be hidden if total < limit)")
            else:
                print("FAILURE: Search bar NOT found.")
                await page.screenshot(path="verification_failure.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="verification_error.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
