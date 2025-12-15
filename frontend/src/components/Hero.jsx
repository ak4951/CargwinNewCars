import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Eye, TrendingUp, Clock, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Hero = () => {
  const [fomoStats, setFomoStats] = useState({
    viewing: 182,
    expiring: 27,
    timeLeft: { hours: 3, minutes: 22 }
  });
  const navigate = useNavigate();
  
  const [quickFilters, setQuickFilters] = useState({
    budget: '',
    brand: '',
    zip: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFomoStats(prev => ({
        viewing: Math.floor(Math.random() * 50) + 150,
        expiring: Math.floor(Math.random() * 10) + 20,
        timeLeft: { hours: 3, minutes: Math.floor(Math.random() * 60) }
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const handleQuickSearch = () => {
    let params = [];
    if (quickFilters.budget) params.push(`budgetMax=${quickFilters.budget}`);
    if (quickFilters.brand) params.push(`brand=${quickFilters.brand}`);
    if (quickFilters.zip) params.push(`zip=${quickFilters.zip}`);
    navigate(`/deals?${params.join('&')}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Compact FOMO - Top Right */}
      <div className="hidden lg:block absolute top-20 right-6 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 w-44">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-blue-600" />
            <div>
              <div className="font-bold text-blue-600">{fomoStats.viewing}</div>
              <div className="text-gray-600">viewing now</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-red-600" />
            <div>
              <div className="font-bold text-red-600">{fomoStats.expiring}</div>
              <div className="text-gray-600">expiring today</div>
            </div>
          </div>
          <div className="border-t pt-2">
            <Clock className="w-3 h-3 text-orange-600 inline mr-1" />
            <span className="font-bold text-orange-600">{fomoStats.timeLeft.hours}h {fomoStats.timeLeft.minutes}m</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white pt-12 pb-14">
        
        {/* Headline - Tighter */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 leading-tight">
          Stop Overpaying.<br />
          Get Fleet Pricing.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-100 font-semibold">
          Save $3,000-7,000 vs Traditional Dealers
        </p>

        {/* Quick Filters - Compact */}
        <div className="max-w-4xl mx-auto mb-5">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl">
            <div className="text-gray-900 font-semibold mb-3 text-base">
              Quick Find Your Perfect Deal:
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Select value={quickFilters.budget} onValueChange={(v) => setQuickFilters({...quickFilters, budget: v})}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Monthly Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Under $300</SelectItem>
                  <SelectItem value="400">Under $400</SelectItem>
                  <SelectItem value="500">Under $500</SelectItem>
                  <SelectItem value="700">$500-700</SelectItem>
                  <SelectItem value="900">Luxury ($700+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={quickFilters.brand} onValueChange={(v) => setQuickFilters({...quickFilters, brand: v})}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="lexus">Lexus</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="tesla">Tesla</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                </SelectContent>
              </Select>

              <input
                type="text"
                maxLength="5"
                placeholder="Your ZIP Code"
                value={quickFilters.zip}
                onChange={(e) => setQuickFilters({...quickFilters, zip: e.target.value.replace(/\D/g, '')})}
                className="h-11 px-3 rounded-lg border border-gray-300 focus:border-red-600 focus:outline-none text-gray-900"
              />

              <Button
                onClick={handleQuickSearch}
                className="h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Deals
              </Button>
            </div>
            
            <div className="text-center mt-3">
              <button
                onClick={() => navigate('/deals')}
                className="text-xs text-gray-600 hover:text-red-600 underline"
              >
                or browse all 15 available deals
              </button>
            </div>
          </div>
        </div>

        {/* Trust Pills - Compact */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-green-400">✓</span>
            <span>Fleet Pricing</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-green-400">✓</span>
            <span>Zero Markup</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-green-400">✓</span>
            <span>Free Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;