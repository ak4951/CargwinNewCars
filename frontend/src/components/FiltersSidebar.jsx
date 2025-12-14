import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { X, SlidersHorizontal, MapPin } from 'lucide-react';
import { searchZipCodes } from '../utils/zipCodes';

const FiltersSidebar = ({ onFilterChange, onClear, allOffers = [], filteredCount = 0 }) => {
  const [filters, setFilters] = useState({
    dealType: 'all',
    brand: 'all',
    model: 'all',
    budgetMin: 0,
    budgetMax: 2000,
    creditScore: 'all',
    term: 'all',
    mileage: 'all',
    fuelType: 'all',
    availableNow: false,
    userZip: ''
  });
  
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [zipSuggestions, setZipSuggestions] = useState([]);
  const [showZipDropdown, setShowZipDropdown] = useState(false);

  // Watch filteredCount changes to update suggestions
  useEffect(() => {
    if (filteredCount === 0 && allOffers.length > 0) {
      generateSuggestions(filters, filteredCount);
    } else {
      setSuggestions([]);
    }
  }, [filteredCount, filters, allOffers.length]);

  // Count offers per filter option
  const countOffersForOption = (filterKey, filterValue) => {
    return allOffers.filter(offer => {
      if (filterKey === 'brand') {
        return offer.make?.toLowerCase() === filterValue.toLowerCase();
      }
      if (filterKey === 'budgetMax') {
        const payment = offer.monthlyPayment || offer.lease?.monthly || 0;
        return payment <= filterValue;
      }
      if (filterKey === 'dealType') {
        if (filterValue === 'lease') return offer.lease;
        if (filterValue === 'finance') return offer.finance;
        return true;
      }
      return true;
    }).length;
  };

  // Generate smart suggestions when 0 results
  const generateSuggestions = (currentFilters, resultCount) => {
    if (resultCount > 0) {
      setSuggestions([]);
      return;
    }

    const tips = [];

    // Budget too low
    if (currentFilters.budgetMax < 500) {
      const countAt400 = countOffersForOption('budgetMax', 400);
      const countAt500 = countOffersForOption('budgetMax', 500);
      if (countAt400 > 0) tips.push(`💡 Increase budget to $400 (+${countAt400} offers)`);
      else if (countAt500 > 0) tips.push(`💡 Increase budget to $500 (+${countAt500} offers)`);
    }

    // Brand filter too restrictive
    if (currentFilters.brand !== 'all') {
      tips.push(`💡 Try "All Brands" to see more options`);
    }

    // Credit score filter
    if (currentFilters.creditScore !== 'all') {
      tips.push(`💡 Remove Credit Score filter`);
    }

    setSuggestions(tips);
  };

  useEffect(() => {
    // Auto-detect location
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    try {
      const { getUserLocation } = await import('../utils/geolocation');
      const location = await getUserLocation();
      
      if (location.zip) {
        setDetectedLocation(location);
        setFilters(prev => ({ ...prev, userZip: location.zip }));
        
        // Notify parent
        if (onFilterChange) {
          onFilterChange({ ...filters, userZip: location.zip });
        }
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    }
  };

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // ZIP auto-complete
    if (key === 'userZip') {
      const results = searchZipCodes(value);
      setZipSuggestions(results);
      setShowZipDropdown(results.length > 0);
    }
    
    if (onFilterChange) {
      onFilterChange(newFilters);
      
      // Generate suggestions after filter change
      setTimeout(() => {
        // This will be called after parent updates filteredOffers
        // For now, just clear suggestions
        generateSuggestions(newFilters, 0);
      }, 100);
    }
  };

  const selectZip = (zipData) => {
    handleChange('userZip', zipData.zip);
    setDetectedLocation({ city: zipData.city, zip: zipData.zip });
    setShowZipDropdown(false);
  };

  const handleClear = () => {
    const cleared = {
      dealType: 'all',
      brand: 'all',
      model: 'all',
      budgetMin: 0,
      budgetMax: 2000,
      creditScore: 'all',
      term: 'all',
      mileage: 'all',
      fuelType: 'all'
    };
    setFilters(cleared);
    setSuggestions([]);
    
    if (onClear) onClear();
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={handleClear}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2">
            <div className="font-semibold text-sm text-yellow-800">💡 Suggestions:</div>
            {suggestions.map((tip, i) => (
              <div key={i} className="text-xs text-yellow-700">{tip}</div>
            ))}
          </div>
        )}
        
        {/* YOUR LOCATION - ПЕРВЫЙ */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
          <label className="text-sm font-medium mb-2 block">📍 Your ZIP Code</label>
          <input
            type="text"
            maxLength="5"
            placeholder="90210 or Los Angeles"
            value={filters.userZip}
            onChange={(e) => handleChange('userZip', e.target.value)}
            onFocus={() => setShowZipDropdown(zipSuggestions.length > 0)}
            className="w-full p-2 border border-gray-300 rounded text-center font-mono text-lg"
          />
          
          {/* ZIP Auto-complete Dropdown */}
          {showZipDropdown && zipSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              {zipSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectZip(item)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 border-b last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900">
                      {item.zip} - {item.city}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.county} County
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {detectedLocation && (
            <p className="text-xs text-blue-700 mt-2 text-center">
              ✓ Detected: {detectedLocation.city}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            We'll show you deals near {filters.userZip ? `ZIP ${filters.userZip}` : 'your area'}
          </p>
        </div>
        
        {/* Deal Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Deal Type</label>
          <Select value={filters.dealType} onValueChange={(v) => handleChange('dealType', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lease">Lease Only</SelectItem>
              <SelectItem value="finance">Finance Only</SelectItem>
              <SelectItem value="cash">Cash Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div>
          <label className="text-sm font-medium mb-2 block">Brand</label>
          <Select value={filters.brand} onValueChange={(v) => handleChange('brand', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands ({allOffers.length})</SelectItem>
              <SelectItem 
                value="lexus" 
                disabled={countOffersForOption('brand', 'lexus') === 0}
              >
                Lexus ({countOffersForOption('brand', 'lexus')})
              </SelectItem>
              <SelectItem 
                value="genesis"
                disabled={countOffersForOption('brand', 'genesis') === 0}
              >
                Genesis ({countOffersForOption('brand', 'genesis')})
              </SelectItem>
              <SelectItem 
                value="toyota"
                disabled={countOffersForOption('brand', 'toyota') === 0}
              >
                Toyota ({countOffersForOption('brand', 'toyota')})
              </SelectItem>
              <SelectItem 
                value="honda"
                disabled={countOffersForOption('brand', 'honda') === 0}
              >
                Honda ({countOffersForOption('brand', 'honda')})
              </SelectItem>
              <SelectItem 
                value="bmw"
                disabled={countOffersForOption('brand', 'bmw') === 0}
              >
                BMW ({countOffersForOption('brand', 'bmw')})
              </SelectItem>
              <SelectItem 
                value="mercedes"
                disabled={countOffersForOption('brand', 'mercedes') === 0}
              >
                Mercedes-Benz ({countOffersForOption('brand', 'mercedes')})
              </SelectItem>
              <SelectItem 
                value="kia"
                disabled={countOffersForOption('brand', 'kia') === 0}
              >
                Kia ({countOffersForOption('brand', 'kia')})
              </SelectItem>
              <SelectItem 
                value="hyundai"
                disabled={countOffersForOption('brand', 'hyundai') === 0}
              >
                Hyundai ({countOffersForOption('brand', 'hyundai')})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div>
          <label className="text-sm font-medium mb-2 block">Model</label>
          <Select value={filters.model} onValueChange={(v) => handleChange('model', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              <SelectItem value="camry">Camry</SelectItem>
              <SelectItem value="accord">Accord</SelectItem>
              <SelectItem value="civic">Civic</SelectItem>
              <SelectItem value="3-series">3 Series</SelectItem>
              <SelectItem value="c-class">C-Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Budget */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Monthly Budget
          </label>
          
          {/* Range Histogram */}
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-2 text-center">
              Распределение предложений по цене
            </div>
            <div className="flex items-end justify-between h-20 gap-1">
              {[
                { range: '$0-200', min: 0, max: 200 },
                { range: '$200-300', min: 200, max: 300 },
                { range: '$300-400', min: 300, max: 400 },
                { range: '$400-500', min: 400, max: 500 },
                { range: '$500-700', min: 500, max: 700 },
                { range: '$700+', min: 700, max: 2000 }
              ].map((bucket, idx) => {
                const count = allOffers.filter(o => {
                  const payment = o.monthlyPayment || o.lease?.monthly || 0;
                  return payment >= bucket.min && payment < bucket.max;
                }).length;
                
                const maxCount = Math.max(1, ...allOffers.map(o => 1));
                const height = allOffers.length > 0 ? (count / allOffers.length) * 100 : 0;
                const isInRange = filters.budgetMin <= bucket.max && filters.budgetMax >= bucket.min;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t transition-all cursor-pointer ${
                        isInRange 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      style={{ height: `${height}%` }}
                      onClick={() => {
                        handleChange('budgetMin', bucket.min);
                        handleChange('budgetMax', bucket.max);
                      }}
                      title={`${count} предложений в диапазоне ${bucket.range}`}
                    />
                    <div className="text-[8px] text-gray-500 text-center leading-tight">
                      {bucket.range}
                    </div>
                    <div className="text-[10px] font-bold text-gray-700">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Min: ${filters.budgetMin}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.budgetMin}
                onChange={(e) => handleChange('budgetMin', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max: ${filters.budgetMax}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.budgetMax}
                onChange={(e) => handleChange('budgetMax', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-500">
              ${filters.budgetMin} - ${filters.budgetMax}/month
            </p>
          </div>
        </div>

        {/* Credit Score */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your Credit Score</label>
          <Select value={filters.creditScore} onValueChange={(v) => handleChange('creditScore', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="720+">720+ (Tier 1)</SelectItem>
              <SelectItem value="680-719">680-719 (Tier 2)</SelectItem>
              <SelectItem value="640-679">640-679 (Tier 3)</SelectItem>
              <SelectItem value="600-639">600-639 (Tier 4)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lease Term */}
        <div>
          <label className="text-sm font-medium mb-2 block">Lease Term</label>
          <Select value={filters.term} onValueChange={(v) => handleChange('term', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Term</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
              <SelectItem value="48">48 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Annual Mileage */}
        <div>
          <label className="text-sm font-medium mb-2 block">Annual Mileage</label>
          <Select value={filters.mileage} onValueChange={(v) => handleChange('mileage', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Mileage</SelectItem>
              <SelectItem value="7500">7,500 miles/year</SelectItem>
              <SelectItem value="10000">10,000 miles/year</SelectItem>
              <SelectItem value="12000">12,000 miles/year</SelectItem>
              <SelectItem value="15000">15,000 miles/year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Fuel Type</label>
          <Select value={filters.fuelType} onValueChange={(v) => handleChange('fuelType', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="plugin">Plug-in Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Available Now Toggle */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
          <label className="text-sm font-medium">Available Now</label>
          <input
            type="checkbox"
            checked={filters.availableNow || false}
            onChange={(e) => handleChange('availableNow', e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        {/* Active Filters Count */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            {Object.values(filters).filter(v => v !== 'all' && v !== 0 && v !== 2000 && v !== false).length} active filters
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersSidebar;
