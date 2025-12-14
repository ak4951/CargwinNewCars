import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, RefreshCw, Trash2, TrendingUp, FileText, Eye, Zap } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SEOPagesManager = () => {
  const [stats, setStats] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchStats();
    fetchPages();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/seo/stats`);
      const data = await response.json();
      if (data.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/seo/pages?limit=20`);
      const data = await response.json();
      if (data.ok) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePages = async () => {
    if (!window.confirm('Generate 1000 SEO pages? This will take 15-20 minutes.')) return;
    
    setGenerating(true);
    setProgress({ current: 0, total: 1000 });
    
    try {
      // Generate in batches of 100
      for (let batch = 0; batch < 10; batch++) {
        const response = await fetch(`${BACKEND_URL}/api/admin/seo/generate-pages?batch_size=100`, {
          method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.ok) {
          setProgress(prev => ({ 
            ...prev, 
            current: prev.current + data.generated 
          }));
          
          // Wait 2 seconds between batches to avoid rate limits
          if (batch < 9) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } else {
          alert(`Error: ${data.message || 'Generation failed'}`);
          break;
        }
      }
      
      alert('✅ All 1000 pages generated!');
      await fetchStats();
      await fetchPages();
      
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const deleteAllPages = async () => {
    if (!window.confirm('Delete ALL SEO pages? This cannot be undone!')) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/seo/pages/all`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.ok) {
        alert(`✅ Deleted ${data.deleted} pages`);
        await fetchStats();
        await fetchPages();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SEO Pages Generator
        </h1>
        <p className="text-gray-600">
          Programmatic SEO: 1000+ landing pages for massive organic traffic
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Pages</div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.total_pages || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: 1,000 pages
                </div>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Views</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats?.total_views?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Organic traffic
                </div>
              </div>
              <Eye className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg. Views/Page</div>
                <div className="text-3xl font-bold text-purple-600">
                  {stats?.total_pages > 0 
                    ? Math.round(stats.total_views / stats.total_pages) 
                    : 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per day
                </div>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Page Types</div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats?.by_type?.length || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Categories
                </div>
              </div>
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Progress */}
      {generating && (
        <Card className="mb-8 border-blue-500 border-2">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  Generating SEO Pages with AI...
                </span>
                <span className="text-sm text-gray-600">
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              ⏱️ This will take 15-20 minutes. Each page gets unique AI-generated content.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={generatePages}
              disabled={generating || (stats?.total_pages || 0) >= 100}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate 1000 SEO Pages
            </Button>
            
            <Button
              onClick={fetchStats}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>
            
            <Button
              onClick={deleteAllPages}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 What gets generated:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 38 City pages (e.g., /deals/los-angeles)</li>
              <li>• 15 Brand pages (e.g., /deals/toyota)</li>
              <li>• 5 Price range pages (e.g., /deals/under-400)</li>
              <li>• 225 City+Brand pages (e.g., /deals/toyota-los-angeles)</li>
              <li>• 75 Brand+Price pages (e.g., /deals/toyota-under-400)</li>
              <li>• 300 City+Brand+Price pages</li>
              <li>• 120 City+Category pages</li>
              <li>• 100 Educational articles</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Pages by Type */}
      {stats?.by_type && stats.by_type.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pages by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.by_type.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item._id}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Pages Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pages (First 20)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No SEO pages yet. Click "Generate" to create them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pages.map((page, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {page.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50">
                          {page.views || 0} views
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {page.meta_title || page.title_template}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {page.meta_description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>🔗 /{page.slug}</span>
                        {page.city && <span>📍 {page.city}</span>}
                        {page.brand && <span>🚗 {page.brand}</span>}
                        {page.price_range && <span>💰 {page.price_range}</span>}
                      </div>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOPagesManager;
