import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const LiveSearch = ({ placeholder = "Поиск по марке, модели...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [popularSearches] = useState([
    'Toyota Camry',
    'Honda Accord',
    'BMW 3 Series',
    'Tesla Model 3',
    'Mercedes C-Class'
  ]);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/api/search?q=${encodeURIComponent(query)}&limit=5`
        );
        
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleResultClick = (dealId) => {
    navigate(`/car/${dealId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handlePopularSearch = (searchTerm) => {
    setQuery(searchTerm);
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-red-600 rounded-xl"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-2xl border-2 border-gray-100">
          <CardContent className="p-0">
            {/* Popular Searches - Show when no query */}
            {!query && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Популярные запросы
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularSearch(term)}
                      className="text-sm hover:bg-red-50 hover:border-red-600 hover:text-red-600"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && results.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <span className="text-sm font-semibold text-gray-700">
                    Найдено: {results.length} {results.length === 1 ? 'автомобиль' : 'автомобиля'}
                  </span>
                </div>
                {results.map((result) => (
                  <div
                    key={result.deal_id}
                    onClick={() => handleResultClick(result.deal_id)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {result.image_url ? (
                        <img
                          src={result.image_url}
                          alt={`${result.make} ${result.model}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {result.year} {result.make} {result.model}
                      </div>
                      {result.trim && (
                        <div className="text-sm text-gray-600 truncate">
                          {result.trim}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      {result.payment > 0 ? (
                        <>
                          <div className="font-bold text-red-600">
                            {formatPrice(result.payment)}/мес
                          </div>
                          {result.msrp > 0 && (
                            <div className="text-xs text-gray-500">
                              MSRP: {formatPrice(result.msrp)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-bold text-gray-900">
                          {formatPrice(result.msrp)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* View All Results */}
                <div className="p-3 bg-gray-50 border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      navigate(`/deals?search=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                    }}
                  >
                    Посмотреть все результаты →
                  </Button>
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto mb-3" />
                </div>
                <div className="text-gray-700 font-semibold mb-1">
                  Ничего не найдено
                </div>
                <div className="text-sm text-gray-500">
                  Попробуйте изменить запрос или воспользуйтесь фильтрами
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/deals')}
                >
                  Посмотреть все предложения
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveSearch;
