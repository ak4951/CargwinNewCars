import sys
import os

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from lease_calculator_pro import calculate_lease_pro
from models_lease_programs import LeaseCalculationRequest

def test_ca_tax_calculation():
    # Mock parsed program
    parsed_program = {
        "brand": "Toyota",
        "model": "Camry",
        "mf": {"36": 0.001},
        "residual": {"36": {"10000": 60}},
        "incentives": {"lease_cash": 1000}
    }

    # Request for 36mo, 10k mi, $35k MSRP, $33k selling price, $2k down, 9.5% tax
    request = LeaseCalculationRequest(
        brand="Toyota",
        model="Camry",
        msrp=35000,
        selling_price=33000,
        term_months=36,
        annual_mileage=10000,
        tax_rate=0.095,
        down_payment=2000,
        drive_off_mode="standard",
        apply_incentives=True,
        acquisition_fee=695,
        doc_fee=85,
        registration_fee=400
    )

    result = calculate_lease_pro(request, parsed_program)

    print(f"Monthly Payment: \${result.monthly_payment_with_tax:.2f}")
    print(f"Upfront Tax: \${result.upfront_tax:.2f}")
    print(f"Estimated Drive-Off: \${result.estimated_drive_off:.2f}")

    # Expected Upfront Tax calculation:
    # CCR = Down Payment ($2000) + Incentives ($1000) = $3000
    # Tax = $3000 * 0.095 = $285
    expected_upfront_tax = (2000 + 1000) * 0.095

    assert abs(result.upfront_tax - expected_upfront_tax) < 0.01, f"Expected {expected_upfront_tax}, got {result.upfront_tax}"

    # Drive-off = Down ($2000) + 1st Month + Doc ($85) + Reg ($400) + Upfront Tax ($285)
    expected_drive_off = 2000 + result.monthly_payment_with_tax + 85 + 400 + expected_upfront_tax
    assert abs(result.estimated_drive_off - expected_drive_off) < 0.01, f"Expected {expected_drive_off}, got {result.estimated_drive_off}"

    print("Test passed!")

if __name__ == "__main__":
    test_ca_tax_calculation()
