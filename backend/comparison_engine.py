"""
Comparison Engine

Compare multiple Featured Deals side-by-side
"""
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


def compare_deals(deals: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compare up to 3 deals and identify best values
    Supports both cars collection and featured_deals collection schemas
    
    Args:
        deals: List of 1-3 deal dicts
        
    Returns:
        Comparison structure with best value indicators
    """
    if not deals or len(deals) > 3:
        raise ValueError("Must provide 1-3 deals for comparison")
    
    # Extract comparable fields (support both schemas)
    comparison_data = []
    
    for deal in deals:
        # Determine schema (cars vs featured_deals)
        is_cars_schema = "make" in deal  # cars collection uses 'make', featured_deals uses 'brand'
        
        if is_cars_schema:
            # Cars collection schema
            lease_data = deal.get("lease", {})
            comparison_data.append({
                "id": deal.get("id"),
                "brand": deal.get("make", ""),  # cars uses 'make'
                "model": deal.get("model", ""),
                "year": deal.get("year", ""),
                "trim": deal.get("trim", ""),
                "monthly_payment": lease_data.get("monthly_payment", deal.get("monthlyPayment", 0)),
                "driveoff": lease_data.get("due_at_signing", 0),
                "onepay": 0,  # Not in cars schema
                "term_months": lease_data.get("term_months", deal.get("termMonths", 0)),
                "annual_mileage": lease_data.get("miles_per_year", 0),
                "msrp": deal.get("msrp", 0),
                "selling_price": deal.get("msrp", 0) - deal.get("discount", 0),
                "bank": deal.get("dealer", ""),  # Use dealer as bank for cars schema
                "mf": 0,  # Not directly available in simplified cars schema
                "residual": 0,  # Not directly available
                "savings": deal.get("discount", 0),
                "image_url": deal.get("images", [None])[0] if deal.get("images") else ""
            })
        else:
            # Legacy featured_deals schema
            comparison_data.append({
                "id": deal.get("id"),
                "brand": deal.get("brand", ""),
                "model": deal.get("model", ""),
                "year": deal.get("year", ""),
                "trim": deal.get("trim", ""),
                "monthly_payment": deal.get("calculated_payment", 0),
                "driveoff": deal.get("calculated_driveoff", 0),
                "onepay": deal.get("calculated_onepay", 0),
                "term_months": deal.get("term_months", 0),
                "annual_mileage": deal.get("annual_mileage", 0),
                "msrp": deal.get("msrp", 0),
                "selling_price": deal.get("selling_price", 0),
                "bank": deal.get("bank", ""),
                "mf": deal.get("mf_used", 0),
                "residual": deal.get("residual_percent_used", 0),
                "savings": deal.get("savings_vs_msrp", 0),
                "image_url": deal.get("image_url", "")
            })
    
    # Identify best values (lowest for costs, highest for savings)
    if len(comparison_data) > 1:
        # Find best monthly payment
        min_payment = min(d["monthly_payment"] for d in comparison_data if d["monthly_payment"] > 0)
        for deal in comparison_data:
            if deal["monthly_payment"] == min_payment and min_payment > 0:
                deal["best_payment"] = True
        
        # Find best driveoff (lowest)
        min_driveoff = min(d["driveoff"] for d in comparison_data if d["driveoff"] >= 0)
        for deal in comparison_data:
            if deal["driveoff"] == min_driveoff:
                deal["best_driveoff"] = True
        
        # Find best savings (highest)
        max_savings = max(d["savings"] for d in comparison_data if d["savings"] >= 0)
        for deal in comparison_data:
            if deal["savings"] == max_savings and max_savings > 0:
                deal["best_savings"] = True
        
        # Find best MF (lowest)
        if any(d["mf"] > 0 for d in comparison_data):
            min_mf = min(d["mf"] for d in comparison_data if d["mf"] > 0)
            for deal in comparison_data:
                if deal["mf"] == min_mf and min_mf > 0:
                    deal["best_mf"] = True
    
    logger.info(f"Compared {len(comparison_data)} deals")
    
    return {
        "deals": comparison_data,
        "count": len(comparison_data)
    }


def get_comparison_summary(deals: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Get summary statistics for comparison
    Supports both cars and featured_deals schemas
    
    Args:
        deals: List of deal dicts
        
    Returns:
        Summary dict with averages and differences
    """
    if not deals:
        return {}
    
    # Determine schema and extract payment/driveoff
    payments = []
    driveoffs = []
    
    for deal in deals:
        is_cars_schema = "make" in deal
        
        if is_cars_schema:
            lease_data = deal.get("lease", {})
            payment = lease_data.get("monthly_payment", deal.get("monthlyPayment", 0))
            driveoff = lease_data.get("due_at_signing", 0)
        else:
            payment = deal.get("calculated_payment", 0)
            driveoff = deal.get("calculated_driveoff", 0)
        
        payments.append(payment)
        driveoffs.append(driveoff)
    
    avg_payment = sum(payments) / len(payments) if payments else 0
    avg_driveoff = sum(driveoffs) / len(driveoffs) if driveoffs else 0
    
    max_payment = max(payments) if payments else 0
    min_payment = min(payments) if payments else 0
    
    best_deal_index = payments.index(min_payment) if payments and min_payment > 0 else 0
    
    return {
        "avg_payment": round(avg_payment, 2),
        "avg_driveoff": round(avg_driveoff, 2),
        "payment_spread": round(max_payment - min_payment, 2),
        "best_deal_index": best_deal_index
    }
