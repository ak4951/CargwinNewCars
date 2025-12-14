import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Calendar, User, TrendingUp } from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/article/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Button asChild className="bg-red-600">
            <Link to="/guides">Browse All Guides</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{article.meta_title}</title>
        <meta name="description" content={article.meta_description} />
        <meta name="keywords" content={article.seo_keywords?.join(', ')} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "author": {"@type": "Organization", "name": "Hunter.Lease"},
            "publisher": {"@type": "Organization", "name": "Hunter.Lease"},
            "datePublished": article.created_at,
            "dateModified": article.updated_at
          })}
        </script>
      </Helmet>

      <Header />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/guides" className="hover:text-red-600">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12 pb-8 border-b">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {article.views} views
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 text-center border border-red-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Your Best Lease Deal?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse exclusive fleet pricing deals and save up to $7,000
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
            <Link to="/deals">View Current Deals</Link>
          </Button>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;
