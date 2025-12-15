"""
Instant Indexing System
- IndexNow API (Bing, Yandex instant indexing)
- Auto sitemap generation
- Search engine ping on content updates
"""
import os
import requests
import hashlib
from datetime import datetime, timezone
from typing import List
import logging

logger = logging.getLogger(__name__)

# IndexNow API key (generate once and reuse)
INDEXNOW_KEY = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"


async def notify_search_engines(urls: List[str]):
    """
    Instantly notify search engines about new/updated URLs
    Uses IndexNow protocol (Bing, Yandex)
    """
    if not urls:
        return
    
    try:
        # IndexNow submission (Bing, Yandex)
        indexnow_payload = {
            "host": "hunter.lease",
            "key": INDEXNOW_KEY,
            "keyLocation": f"https://hunter.lease/{INDEXNOW_KEY}.txt",
            "urlList": urls
        }
        
        # Submit to Bing IndexNow
        bing_response = requests.post(
            "https://api.indexnow.org/indexnow",
            json=indexnow_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if bing_response.status_code == 200:
            logger.info(f"✅ IndexNow: {len(urls)} URLs submitted to Bing/Yandex")
        else:
            logger.warning(f"IndexNow failed: {bing_response.status_code}")
        
        # Ping Google (traditional)
        for url in urls[:10]:  # Limit to avoid spam
            try:
                requests.get(
                    f"https://www.google.com/ping?sitemap={url}",
                    timeout=5
                )
            except:
                pass
        
        logger.info(f"✅ Notified search engines about {len(urls)} URLs")
        
    except Exception as e:
        logger.error(f"Search engine notification error: {e}")


async def generate_dynamic_sitemap(db) -> str:
    """
    Auto-generate sitemap XML from database
    Called on every content update
    """
    from datetime import datetime
    
    # Static pages
    static_urls = [
        {"loc": "https://hunter.lease/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "https://hunter.lease/deals", "priority": "1.0", "changefreq": "daily"},
        {"loc": "https://hunter.lease/calculator", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "https://hunter.lease/reviews", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "https://hunter.lease/about", "priority": "0.7", "changefreq": "monthly"},
    ]
    
    # Offers
    offers = await db.cars.find(
        {"published": True},
        {"id": 1, "updatedAt": 1, "_id": 1}
    ).to_list(None)
    
    offer_urls = [
        {
            "loc": f"https://hunter.lease/car/{str(o.get('_id'))}",
            "priority": "0.9",
            "changefreq": "daily",
            "lastmod": o.get('updatedAt', datetime.now(timezone.utc).isoformat())
        }
        for o in offers
    ]
    
    # SEO pages
    seo_pages = await db.seo_pages.find(
        {"status": "published"},
        {"slug": 1, "updated_at": 1, "priority": 1, "_id": 0}
    ).to_list(None)
    
    seo_urls = [
        {
            "loc": f"https://hunter.lease/{p['slug']}",
            "priority": "0.9" if p.get('priority') == 'high' else "0.7",
            "changefreq": "weekly",
            "lastmod": p.get('updated_at', datetime.now(timezone.utc).isoformat())
        }
        for p in seo_pages
    ]
    
    # Articles
    articles = await db.articles.find(
        {"published": True},
        {"slug": 1, "updated_at": 1, "_id": 0}
    ).to_list(None)
    
    article_urls = [
        {
            "loc": f"https://hunter.lease/guides/{a['slug']}",
            "priority": "0.8",
            "changefreq": "monthly",
            "lastmod": a.get('updated_at', datetime.now(timezone.utc).isoformat())
        }
        for a in articles
    ]
    
    # Combine all
    all_urls = static_urls + offer_urls + seo_urls + article_urls
    
    # Build XML
    url_entries = []
    for url_data in all_urls:
        url_entries.append(f"""    <url>
        <loc>{url_data['loc']}</loc>
        <lastmod>{url_data.get('lastmod', datetime.now(timezone.utc).isoformat())[:10]}</lastmod>
        <changefreq>{url_data['changefreq']}</changefreq>
        <priority>{url_data['priority']}</priority>
    </url>""")
    
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(url_entries)}
</urlset>"""
    
    logger.info(f"✅ Generated sitemap with {len(all_urls)} URLs")
    
    return sitemap_xml


async def auto_index_new_content(db, content_type: str, content_id: str):
    """
    Automatically index new content when created
    Call this after creating offer, SEO page, or article
    """
    url_map = {
        "offer": f"https://hunter.lease/car/{content_id}",
        "seo_page": f"https://hunter.lease/{content_id}",
        "article": f"https://hunter.lease/guides/{content_id}"
    }
    
    url = url_map.get(content_type)
    if url:
        await notify_search_engines([url])
        logger.info(f"✅ Auto-indexed: {url}")
