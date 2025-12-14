import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { X, ArrowRight } from 'lucide-react';

const CompareBar = ({ selectedOffers, onRemove, onClear }) => {
  const navigate = useNavigate();

  if (selectedOffers.length === 0) return null;

  const handleCompare = () => {
    const ids = selectedOffers.map(o => o.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-red-600 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Selected offers */}
          <div className="flex items-center gap-4 flex-1 overflow-x-auto w-full">
            <div className="font-semibold text-gray-900 whitespace-nowrap">
              Сравнить ({selectedOffers.length}/3):
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {selectedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-fit"
                >
                  <img
                    src={(offer.images && offer.images[0]) || 'https://via.placeholder.com/50'}
                    alt={offer.title || `${offer.year} ${offer.make} ${offer.model}`}
                    className="w-10 h-8 object-cover rounded"
                  />
                  <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {offer.year} {offer.make} {offer.model}
                  </div>
                  <button
                    onClick={() => onRemove(offer.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClear}
              className="whitespace-nowrap"
            >
              Очистить
            </Button>
            <Button
              onClick={handleCompare}
              disabled={selectedOffers.length < 2}
              className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap disabled:opacity-50"
            >
              Сравнить {selectedOffers.length > 1 && `(${selectedOffers.length})`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
