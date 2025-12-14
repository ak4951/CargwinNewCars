import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Search, Calculator } from 'lucide-react';

const StickyCTABar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 800px
      if (window.scrollY > 800) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on deals or admin pages
  if (location.pathname.includes('/deals') || location.pathname.includes('/admin')) {
    return null;
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-red-600 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">
              Ready to save $10,360 on your next car?
            </div>
            <div className="text-xs text-gray-600">
              Join 10,000+ Californians who stopped overpaying
            </div>
          </div>

          <div className="flex gap-3 flex-1 sm:flex-initial">
            <Button
              onClick={() => navigate('/deals')}
              className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Find My Car
            </Button>
            <Button
              onClick={() => navigate('/calculator')}
              variant="outline"
              className="hidden sm:inline-flex"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCTABar;