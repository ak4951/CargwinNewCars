import asyncio
import os
import sys
import json
from uuid import uuid4
from datetime import datetime, timezone
from mongomock_motor import AsyncMongoMockClient

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from lease_calculator_pro import calculate_lease_pro
from models_lease_programs import LeaseCalculationRequest
from db_featured_deals import create_deal, list_deals

async def run_e2e_test():
    print("🚀 Starting E2E Mock Test (using mongomock-motor)")
    client = AsyncMongoMockClient()
    db = client['test_db']

    # 1. Scrape offers (simulated)
    print("📥 1. Simulating scrape...")
    scraped_data = [
        {"make": "Toyota", "model": "Camry", "year": 2025, "msrp": 35000, "payment": 399, "images": ["camry.jpg"], "region": "California"},
        {"make": "Toyota", "model": "RAV4", "year": 2025, "msrp": 38000, "payment": 450, "images": ["rav4.jpg"], "region": "California"}
    ]

    # 2. Import offers
    print("💾 2. Importing offers...")
    for offer in scraped_data:
        deal = {
            "id": str(uuid4()),
            "brand": offer.get('make'),
            "model": offer.get('model'),
            "year": offer.get('year'),
            "msrp": offer.get('msrp'),
            "calculated_payment": offer.get('payment'),
            "image_url": offer.get('images')[0],
            "region": offer.get('region'),
            "created_at": datetime.now(timezone.utc),
            "is_active": True
        }
        await create_deal(db, deal)

    # 3. Confirm offers appear & Search/Pagination
    print("🔍 3 & 4. Verifying search and pagination...")
    list_result = await list_deals(db, search="Camry")
    assert list_result['total'] == 1
    assert list_result['deals'][0]['model'] == "Camry"
    print("✅ Search OK")

    # 5. Open specific offer (California calculation)
    print("🧮 5 & 6 & 7. Running California lease calculation...")
    # Mock bank program for Camry
    camry_program = {
        "brand": "Toyota",
        "model": "Camry",
        "mf": {"36": 0.00125},
        "residual": {"36": {"10000": 58}},
        "incentives": {"lease_cash": 1500}
    }

    calc_request = LeaseCalculationRequest(
        brand="Toyota",
        model="Camry",
        msrp=35000,
        selling_price=32000, # k off MSRP
        term_months=36,
        annual_mileage=10000,
        tax_rate=0.095, # California average
        down_payment=2500,
        drive_off_mode="standard",
        apply_incentives=True,
        acquisition_fee=650,
        doc_fee=85,
        registration_fee=450
    )

    result = calculate_lease_pro(calc_request, camry_program)

    # Verification of math
    print(f"   Monthly Payment: ${result.monthly_payment_with_tax:.2f}")
    print(f"   Upfront Tax: ${result.upfront_tax:.2f}")
    print(f"   Total Drive-off: ${result.estimated_drive_off:.2f}")

    # CCR = 2500 (down) + 1500 (incentive) = 4000
    # Upfront Tax = 4000 * 0.095 = 380.00
    assert abs(result.upfront_tax - 380.00) < 0.01
    print("✅ California Upfront Tax OK")

    # Monthly Tax logic check
    assert abs(result.monthly_payment_with_tax - 337.99) < 0.1
    print("✅ Monthly Payment with Tax OK")

    # 9. Thousands of offers performance check
    print("📈 9. Simulating thousands of offers...")
    large_batch = []
    for i in range(1000):
        large_batch.append({
            "id": str(uuid4()),
            "brand": "Brand" + str(i % 10),
            "model": "Model" + str(i),
            "created_at": datetime.now(timezone.utc)
        })
    await db.featured_deals.insert_many(large_batch)

    start_time = datetime.now()
    paginated_result = await list_deals(db, skip=900, limit=20)
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    assert paginated_result['total'] >= 1002
    assert len(paginated_result['deals']) == 20
    print(f"✅ Pagination over thousands of offers took {duration:.4f}s")

    print("🎉 All E2E Mock Tests Passed!")

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
