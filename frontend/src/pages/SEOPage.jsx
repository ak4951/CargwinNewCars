import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OfferCard from '../components/OfferCard';
import { Button } from '../components/ui/button';
import { MapPin, Tag, DollarSign, ArrowRight } from 'lucide-react';

const SEOPage = () => {
  const { slug } = useParams();
  const actualSlug = slug || window.location.pathname.replace('/', '');
  const [pageData, setPageData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, [slug]);

  const fetchPageData = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      
      // Fetch SEO page data
      const pageResponse = await fetch(`${BACKEND_URL}/api/seo-page/${slug}`);
      
      if (pageResponse.ok) {
        const pageData = await pageResponse.json();
        setPageData(pageData);
        
        // Fetch matching offers
        await fetchMatchingOffers(pageData);
      } else {
        setPageData(null);
      }
    } catch (error) {
      console.error('Error loading SEO page:', error);
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchingOffers = async (pageConfig) => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/cars`);
      
      if (response.ok) {
        let allOffers = await response.json();
        
        // Filter by page config
        let filtered = allOffers;
        
        // Filter by brand
        if (pageConfig.brand_slug) {
          filtered = filtered.filter(o => 
            o.make?.toLowerCase() === pageConfig.brand_slug.toLowerCase()
          );
        }
        
        // Filter by price
        if (pageConfig.price_min !== undefined) {
          filtered = filtered.filter(o => {
            const payment = o.monthlyPayment || o.lease?.monthly || 0;
            return payment >= pageConfig.price_min && payment <= pageConfig.price_max;
          });
        }
        
        setOffers(filtered);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
            <Link to="/deals">Browse All Deals</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{pageData.meta_title}</title>
        <meta name="description" content={pageData.meta_description} />
        <meta name="keywords" content={pageData.seo_keywords?.join(', ')} />
        
        <meta property="og:title" content={pageData.meta_title} />
        <meta property="og:description" content={pageData.meta_description} />
        <meta property="og:type" content="website" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProductCollection",
            "name": pageData.h1,
            "description": pageData.meta_description,
            "url": `https://hunter.lease/${pageData.slug}`
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6 opacity-90">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/deals" className="hover:underline">Deals</Link>
            <span className="mx-2">/</span>
            <span>{pageData.city || pageData.brand || pageData.category}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {pageData.h1}
          </h1>
          
          <p className="text-xl opacity-90 mb-6 max-w-3xl">
            {pageData.intro_text}
          </p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap gap-3">
            {pageData.city && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {pageData.city}, CA
              </div>
            )}
            {pageData.brand && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {pageData.brand}
              </div>
            )}
            {pageData.price_range && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {pageData.price_range}
              </div>
            )}
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              {offers.length} Deals Available
            </div>
          </div>
        </div>
      </div>

      {/* Why Lease Here Section */}
      {pageData.why_lease_here && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Lease {pageData.brand || 'Here'}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageData.why_lease_here.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Available Deals ({offers.length})
        </h2>

        {offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">No deals match these criteria right now.</p>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link to="/deals">View All Deals</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SEOPage;
