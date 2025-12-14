"""
SEO Pages Generator
Programmatic SEO for Hunter.Lease - 1000+ unique landing pages
"""
import os
from typing import List, Dict, Any
from datetime import datetime, timezone
import hashlib
import logging

logger = logging.getLogger(__name__)

# California cities with coordinates and counties
CALIFORNIA_CITIES = [
    {"name": "Los Angeles", "slug": "los-angeles", "zip": "90001", "county": "Los Angeles", "population": "high"},
    {"name": "San Francisco", "slug": "san-francisco", "zip": "94102", "county": "San Francisco", "population": "high"},
    {"name": "San Diego", "slug": "san-diego", "zip": "92101", "county": "San Diego", "population": "high"},
    {"name": "San Jose", "slug": "san-jose", "zip": "95110", "county": "Santa Clara", "population": "high"},
    {"name": "Fresno", "slug": "fresno", "zip": "93721", "county": "Fresno", "population": "medium"},
    {"name": "Sacramento", "slug": "sacramento", "zip": "95814", "county": "Sacramento", "population": "high"},
    {"name": "Long Beach", "slug": "long-beach", "zip": "90802", "county": "Los Angeles", "population": "medium"},
    {"name": "Oakland", "slug": "oakland", "zip": "94612", "county": "Alameda", "population": "medium"},
    {"name": "Bakersfield", "slug": "bakersfield", "zip": "93301", "county": "Kern", "population": "medium"},
    {"name": "Anaheim", "slug": "anaheim", "zip": "92805", "county": "Orange", "population": "medium"},
    {"name": "Santa Ana", "slug": "santa-ana", "zip": "92701", "county": "Orange", "population": "medium"},
    {"name": "Riverside", "slug": "riverside", "zip": "92501", "county": "Riverside", "population": "medium"},
    {"name": "Stockton", "slug": "stockton", "zip": "95202", "county": "San Joaquin", "population": "medium"},
    {"name": "Irvine", "slug": "irvine", "zip": "92618", "county": "Orange", "population": "medium"},
    {"name": "Chula Vista", "slug": "chula-vista", "zip": "91910", "county": "San Diego", "population": "medium"},
    {"name": "Fremont", "slug": "fremont", "zip": "94538", "county": "Alameda", "population": "medium"},
    {"name": "San Bernardino", "slug": "san-bernardino", "zip": "92401", "county": "San Bernardino", "population": "medium"},
    {"name": "Modesto", "slug": "modesto", "zip": "95354", "county": "Stanislaus", "population": "low"},
    {"name": "Fontana", "slug": "fontana", "zip": "92335", "county": "San Bernardino", "population": "low"},
    {"name": "Oxnard", "slug": "oxnard", "zip": "93030", "county": "Ventura", "population": "low"},
    {"name": "Moreno Valley", "slug": "moreno-valley", "zip": "92553", "county": "Riverside", "population": "low"},
    {"name": "Huntington Beach", "slug": "huntington-beach", "zip": "92648", "county": "Orange", "population": "medium"},
    {"name": "Glendale", "slug": "glendale", "zip": "91201", "county": "Los Angeles", "population": "medium"},
    {"name": "Santa Clarita", "slug": "santa-clarita", "zip": "91350", "county": "Los Angeles", "population": "medium"},
    {"name": "Garden Grove", "slug": "garden-grove", "zip": "92840", "county": "Orange", "population": "low"},
    {"name": "Oceanside", "slug": "oceanside", "zip": "92054", "county": "San Diego", "population": "low"},
    {"name": "Rancho Cucamonga", "slug": "rancho-cucamonga", "zip": "91701", "county": "San Bernardino", "population": "low"},
    {"name": "Ontario", "slug": "ontario", "zip": "91761", "county": "San Bernardino", "population": "low"},
    {"name": "Santa Rosa", "slug": "santa-rosa", "zip": "95401", "county": "Sonoma", "population": "low"},
    {"name": "Elk Grove", "slug": "elk-grove", "zip": "95624", "county": "Sacramento", "population": "low"},
    {"name": "Corona", "slug": "corona", "zip": "92879", "county": "Riverside", "population": "low"},
    {"name": "Pasadena", "slug": "pasadena", "zip": "91101", "county": "Los Angeles", "population": "medium"},
    {"name": "Beverly Hills", "slug": "beverly-hills", "zip": "90210", "county": "Los Angeles", "population": "high"},
    {"name": "Santa Monica", "slug": "santa-monica", "zip": "90401", "county": "Los Angeles", "population": "high"},
    {"name": "Newport Beach", "slug": "newport-beach", "zip": "92660", "county": "Orange", "population": "high"},
    {"name": "Palo Alto", "slug": "palo-alto", "zip": "94301", "county": "Santa Clara", "population": "high"},
    {"name": "Torrance", "slug": "torrance", "zip": "90501", "county": "Los Angeles", "population": "medium"},
    {"name": "Costa Mesa", "slug": "costa-mesa", "zip": "92626", "county": "Orange", "population": "medium"},
]

BRANDS = [
    {"name": "Toyota", "slug": "toyota", "tier": "mass"},
    {"name": "Honda", "slug": "honda", "tier": "mass"},
    {"name": "Lexus", "slug": "lexus", "tier": "luxury"},
    {"name": "BMW", "slug": "bmw", "tier": "luxury"},
    {"name": "Mercedes-Benz", "slug": "mercedes", "tier": "luxury"},
    {"name": "Audi", "slug": "audi", "tier": "luxury"},
    {"name": "Tesla", "slug": "tesla", "tier": "luxury"},
    {"name": "Nissan", "slug": "nissan", "tier": "mass"},
    {"name": "Mazda", "slug": "mazda", "tier": "mass"},
    {"name": "Hyundai", "slug": "hyundai", "tier": "mass"},
    {"name": "Kia", "slug": "kia", "tier": "mass"},
    {"name": "Subaru", "slug": "subaru", "tier": "mass"},
    {"name": "Volkswagen", "slug": "volkswagen", "tier": "mass"},
    {"name": "Ford", "slug": "ford", "tier": "mass"},
    {"name": "Chevrolet", "slug": "chevrolet", "tier": "mass"},
]

PRICE_RANGES = [
    {"name": "Under $300", "slug": "under-300", "min": 0, "max": 300},
    {"name": "Under $400", "slug": "under-400", "min": 0, "max": 400},
    {"name": "$300-$500", "slug": "300-to-500", "min": 300, "max": 500},
    {"name": "$500-$700", "slug": "500-to-700", "min": 500, "max": 700},
    {"name": "Luxury ($700+)", "slug": "luxury", "min": 700, "max": 9999},
]

CATEGORIES = [
    {"name": "Electric Vehicles", "slug": "electric-vehicles", "filter": "fuel_type=electric"},
    {"name": "Hybrid Cars", "slug": "hybrid-cars", "filter": "fuel_type=hybrid"},
    {"name": "SUVs", "slug": "suvs", "filter": "body_type=suv"},
    {"name": "Sedans", "slug": "sedans", "filter": "body_type=sedan"},
    {"name": "Luxury Cars", "slug": "luxury-cars", "filter": "tier=luxury"},
    {"name": "Zero Down Payment", "slug": "zero-down", "filter": "down_payment=0"},
    {"name": "24 Month Lease", "slug": "24-month", "filter": "term=24"},
    {"name": "36 Month Lease", "slug": "36-month", "filter": "term=36"},
]


def generate_unique_slug(parts: List[str]) -> str:
    """Generate unique URL slug from parts"""
    clean_parts = [p.strip().lower().replace(' ', '-') for p in parts if p]
    slug = '-'.join(clean_parts)
    # Ensure uniqueness with hash if needed
    return slug


def generate_page_combinations() -> List[Dict[str, Any]]:
    """
    Generate all unique page combinations
    Returns list of page configs (max 1000)
    """
    pages = []
    page_set = set()  # Track unique slugs to avoid duplicates
    
    # Type 1: City pages (38 pages)
    for city in CALIFORNIA_CITIES:
        slug = f"deals-{city['slug']}"
        if slug not in page_set:
            pages.append({
                "type": "city",
                "slug": slug,
                "city": city['name'],
                "city_slug": city['slug'],
                "title_template": f"Car Lease Deals in {city['name']}, CA",
                "priority": "high" if city['population'] == 'high' else 'medium'
            })
            page_set.add(slug)
    
    # Type 2: Brand pages (15 pages)
    for brand in BRANDS:
        slug = f"deals-{brand['slug']}"
        if slug not in page_set:
            pages.append({
                "type": "brand",
                "slug": slug,
                "brand": brand['name'],
                "brand_slug": brand['slug'],
                "title_template": f"{brand['name']} Lease Deals in California",
                "priority": "high"
            })
            page_set.add(slug)
    
    # Type 3: Price range pages (5 pages)
    for price in PRICE_RANGES:
        slug = f"deals-{price['slug']}"
        if slug not in page_set:
            pages.append({
                "type": "price",
                "slug": slug,
                "price_range": price['name'],
                "price_min": price['min'],
                "price_max": price['max'],
                "title_template": f"Car Lease Deals {price['name']}/Month",
                "priority": "high"
            })
            page_set.add(slug)
    
    # Type 4: City + Brand (TOP 15 cities × 15 brands = 225 pages)
    top_cities = [c for c in CALIFORNIA_CITIES if c['population'] in ['high', 'medium']][:15]
    for city in top_cities:
        for brand in BRANDS:
            slug = f"deals-{brand['slug']}-{city['slug']}"
            if slug not in page_set and len(pages) < 1000:
                pages.append({
                    "type": "city-brand",
                    "slug": slug,
                    "city": city['name'],
                    "city_slug": city['slug'],
                    "brand": brand['name'],
                    "brand_slug": brand['slug'],
                    "title_template": f"{brand['name']} Lease Deals in {city['name']}, CA",
                    "priority": "high" if city['population'] == 'high' else 'medium'
                })
                page_set.add(slug)
    
    # Type 5: Brand + Price (15 brands × 5 prices = 75 pages)
    for brand in BRANDS:
        for price in PRICE_RANGES:
            slug = f"deals-{brand['slug']}-{price['slug']}"
            if slug not in page_set and len(pages) < 1000:
                pages.append({
                    "type": "brand-price",
                    "slug": slug,
                    "brand": brand['name'],
                    "brand_slug": brand['slug'],
                    "price_range": price['name'],
                    "price_min": price['min'],
                    "price_max": price['max'],
                    "title_template": f"{brand['name']} Lease {price['name']}/Month",
                    "priority": "medium"
                })
                page_set.add(slug)
    
    # Type 6: City + Brand + Price (TOP 10 cities × 10 brands × 3 prices = 300 pages)
    top_cities_small = [c for c in CALIFORNIA_CITIES if c['population'] == 'high'][:10]
    top_brands = BRANDS[:10]
    top_prices = PRICE_RANGES[:3]
    
    for city in top_cities_small:
        for brand in top_brands:
            for price in top_prices:
                slug = f"deals-{brand['slug']}-{city['slug']}-{price['slug']}"
                if slug not in page_set and len(pages) < 1000:
                    pages.append({
                        "type": "city-brand-price",
                        "slug": slug,
                        "city": city['name'],
                        "city_slug": city['slug'],
                        "brand": brand['name'],
                        "brand_slug": brand['slug'],
                        "price_range": price['name'],
                        "price_min": price['min'],
                        "price_max": price['max'],
                        "title_template": f"{brand['name']} Lease {price['name']}/Month in {city['name']}, CA",
                        "priority": "high"
                    })
                    page_set.add(slug)
    
    # Type 7: Category pages (8 pages)
    for category in CATEGORIES:
        slug = f"deals-{category['slug']}"
        if slug not in page_set and len(pages) < 1000:
            pages.append({
                "type": "category",
                "slug": slug,
                "category": category['name'],
                "title_template": f"{category['name']} Lease Deals in California",
                "priority": "medium"
            })
            page_set.add(slug)
    
    # Type 8: City + Category (TOP 15 cities × 8 categories = 120 pages)
    for city in top_cities:
        for category in CATEGORIES:
            slug = f"deals-{category['slug']}-{city['slug']}"
            if slug not in page_set and len(pages) < 1000:
                pages.append({
                    "type": "city-category",
                    "slug": slug,
                    "city": city['name'],
                    "city_slug": city['slug'],
                    "category": category['name'],
                    "title_template": f"{category['name']} Lease Deals in {city['name']}, CA",
                    "priority": "medium"
                })
                page_set.add(slug)
    
    logger.info(f"Generated {len(pages)} unique page combinations (no duplicates)")
    return pages[:1000]  # Limit to exactly 1000


async def generate_page_content_with_ai(page_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate unique SEO content using AI
    """
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        from dotenv import load_dotenv
        load_dotenv()
        
        api_key = os.getenv('EMERGENT_LLM_KEY')
        
        # Create prompt based on page type
        prompt = f"""Generate SEO-optimized content for a car lease deals page.

Page Type: {page_config['type']}
Target: {page_config.get('title_template', '')}
City: {page_config.get('city', 'California')}
Brand: {page_config.get('brand', 'All brands')}
Price Range: {page_config.get('price_range', 'All prices')}

Generate JSON with:
1. meta_title (60 chars max, include keywords)
2. meta_description (155 chars max, compelling)
3. h1 (main heading, engaging)
4. intro_text (2-3 sentences about this specific combination)
5. why_lease_here (3 bullet points why lease in this city/brand)
6. seo_keywords (10 keywords array)

Make it unique, natural, persuasive. Focus on California, car leasing benefits.
Return ONLY valid JSON, no markdown."""

        chat = LlmChat(
            api_key=api_key,
            session_id=f"seo_{page_config['slug']}",
            system_message="You are an expert SEO content writer for car lease websites."
        ).with_model("openai", "gpt-5.1")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse JSON response
        import json
        content = json.loads(response.strip().replace('```json', '').replace('```', ''))
        
        return content
        
    except Exception as e:
        logger.error(f"AI content generation failed: {e}")
        # Fallback to template
        return generate_template_content(page_config)


def generate_template_content(page_config: Dict[str, Any]) -> Dict[str, Any]:
    """Fallback template-based content"""
    city = page_config.get('city', 'California')
    brand = page_config.get('brand', '')
    price = page_config.get('price_range', '')
    
    title_parts = [p for p in [brand, 'Lease Deals', price, city, 'CA'] if p]
    
    return {
        "meta_title": ' '.join(title_parts)[:60],
        "meta_description": f"Find the best {brand or 'car'} lease deals in {city}. {price or 'Competitive prices'}. No hidden fees. Apply online today.",
        "h1": page_config.get('title_template', 'Car Lease Deals'),
        "intro_text": f"Discover exclusive lease offers in {city}, California.",
        "why_lease_here": [
            "Competitive monthly payments",
            "No dealer markup",
            "Instant approval process"
        ],
        "seo_keywords": [brand, city, "lease", "deals", "California"]
    }


def get_article_topics() -> List[Dict[str, str]]:
    """Generate 100 article topics about car leasing"""
    topics = [
        {"title": "Complete Guide to Car Leasing in California 2025", "slug": "car-leasing-guide-california"},
        {"title": "Lease vs Buy: Which is Better in 2025?", "slug": "lease-vs-buy-2025"},
        {"title": "How to Negotiate a Car Lease Deal", "slug": "negotiate-car-lease"},
        {"title": "Understanding Money Factor in Car Leases", "slug": "understanding-money-factor"},
        {"title": "Best Cars to Lease Under $300/Month", "slug": "best-cars-under-300"},
        {"title": "Electric Vehicle Leasing Guide", "slug": "ev-leasing-guide"},
        {"title": "Bad Credit Car Leasing Options", "slug": "bad-credit-leasing"},
        {"title": "End of Lease: Buy, Return, or Extend?", "slug": "end-of-lease-options"},
        {"title": "Car Lease Tax Deductions for Business", "slug": "lease-tax-deductions"},
        {"title": "Zero Down Payment Car Leases", "slug": "zero-down-leases"},
        {"title": "How to Calculate Car Lease Payments", "slug": "calculate-lease-payments"},
        {"title": "Best Luxury Cars to Lease in 2025", "slug": "best-luxury-leases"},
        {"title": "Toyota Lease Deals: Complete Guide", "slug": "toyota-lease-guide"},
        {"title": "Honda Lease Specials Explained", "slug": "honda-lease-specials"},
        {"title": "BMW Lease Programs Overview", "slug": "bmw-lease-programs"},
        {"title": "Tesla Leasing: Is It Worth It?", "slug": "tesla-leasing-worth-it"},
        {"title": "Car Leasing for First-Time Buyers", "slug": "first-time-lease"},
        {"title": "Mileage Limits in Car Leases", "slug": "lease-mileage-limits"},
        {"title": "GAP Insurance for Leased Cars", "slug": "gap-insurance-leasing"},
        {"title": "Early Lease Termination Guide", "slug": "early-lease-termination"},
    ]
    
    # Generate 80 more topics programmatically
    additional_templates = [
        "Leasing {brand} in California: Pros and Cons",
        "{brand} {model} Lease Review 2025",
        "Best Time to Lease a {brand}",
        "How Much Does it Cost to Lease a {brand} {model}?",
        "{city} Car Lease Market Analysis",
        "Top 10 Lease Deals in {city} This Month",
    ]
    
    models = ["Camry", "Accord", "Model 3", "X5", "RX350", "Q5", "3 Series", "A4"]
    
    for i, template in enumerate(additional_templates * 15):
        if len(topics) >= 100:
            break
        
        brand = BRANDS[i % len(BRANDS)]['name']
        model = models[i % len(models)]
        city = CALIFORNIA_CITIES[i % len(CALIFORNIA_CITIES)]['name']
        
        title = template.format(brand=brand, model=model, city=city)
        slug = title.lower().replace(' ', '-').replace(':', '').replace('?', '').replace(',', '')
        
        if not any(t['slug'] == slug for t in topics):
            topics.append({"title": title, "slug": slug})
    
    return topics[:100]
