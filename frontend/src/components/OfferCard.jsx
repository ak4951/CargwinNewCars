import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Plus, Check } from 'lucide-react';

const OfferCard = ({ offer, onCompareToggle, isSelected, matchScore, badges }) => {
  const [isSaved, setIsSaved] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({ hours: 14, minutes: 32, seconds: 18 });

  // Countdown timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) hours = 0;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Extract data
  const title = offer.title || `${offer.year || ''} ${offer.make || ''} ${offer.model || ''}`.trim();
  const payment = offer.monthlyPayment || offer.lease?.monthly || offer.finance?.monthly || 0;
  const dealType = offer.dealType || (offer.lease ? 'Lease' : offer.finance ? 'Finance' : 'Cash');
  const term = offer.termMonths || offer.lease?.termMonths || offer.finance?.termMonths || 0;
  const miles = offer.mileage || offer.lease?.milesPerYear || 0;
  const savings = offer.discount || offer.savings || 0;
  const msrp = offer.msrp || 0;
  const stockLeft = offer.stock || 2; // Default to 2 for demo
  
  // Calculate dealer comparison (dealer usually 20-25% higher)
  const dealerPayment = Math.round(payment * 1.22);
  const savingsVsDealer = dealerPayment - payment;
  const savingsPercent = msrp > 0 ? Math.round((savings / msrp) * 100) : 0;
  
  // CANONICAL ID
  const offerId = offer.id || offer._id || '';
  
  const toggleSaved = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('hunter_saved_cars') || '[]');
    
    if (isSaved) {
      const updated = saved.filter(id => id !== offer.id);
      localStorage.setItem('hunter_saved_cars', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      saved.push(offer.id);
      localStorage.setItem('hunter_saved_cars', JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('hunter_saved_cars') || '[]');
    setIsSaved(saved.includes(offer.id));
  }, [offer.id]);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-2xl transition-all duration-300 overflow-hidden h-full relative">
      {/* Compare Checkbox */}
      {onCompareToggle && (
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle(offer);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-red-600 text-white shadow-lg scale-110'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50'
            }`}
          >
            {isSelected ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Match Score Badge */}
      {matchScore !== undefined && matchScore < 100 && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            matchScore >= 80 ? 'bg-green-500 text-white' :
            matchScore >= 50 ? 'bg-yellow-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {matchScore}% Match
          </div>
        </div>
      )}

      {/* Top Badges (Best Deal, Hot, New) */}
      {badges && badges.length > 0 && (
        <div className="absolute top-12 right-2 z-10 flex flex-col gap-1">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`${badge.color} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg`}
            >
              {badge.text}
            </div>
          ))}
        </div>
      )}

      <Link to={`/car/${offerId}`}>
        <div className="cursor-pointer transform hover:scale-105 transition-transform duration-300">
          {/* Image */}
          <div className="h-40 sm:h-48 bg-gray-200 overflow-hidden relative">
            <img
              src={(offer.images && offer.images[0]) || offer.image || 'https://via.placeholder.com/400x300'}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Stock Badge */}
            {stockLeft <= 3 && (
              <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                🔥 Only {stockLeft} left
              </div>
            )}
          </div>

        {/* Content - Compact */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-1">
            {title}
          </h3>

          {/* Deal Type + Term */}
          <div className="flex gap-2 mb-2 text-xs">
            <Badge variant="secondary" className="text-xs">{dealType}</Badge>
            {term > 0 && <span className="text-gray-600">{term}mo</span>}
            {miles > 0 && <span className="text-gray-600">• {(miles / 1000).toFixed(1)}k mi/yr</span>}
          </div>

          {/* Dealer Comparison */}
          {payment > 0 && (
            <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dealer Price:</span>
                <span className="line-through text-gray-500">${dealerPayment}/mo</span>
              </div>
              <div className="flex justify-between items-center font-bold text-green-700">
                <span>You Save:</span>
                <span>${savingsVsDealer}/mo (22%)</span>
              </div>
            </div>
          )}

          {/* Payment - HUGE & BOLD */}
          <div className="mb-2">
            <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 animate-pulse-slow">
              ${payment.toFixed(0)}
              <span className="text-xs sm:text-sm text-gray-600 font-normal">/mo</span>
            </div>
          </div>

          {/* Savings Badge - Prominent */}
          {savings > 0 && (
            <div className="mb-3">
              <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                ↓ Save ${savings.toLocaleString()} ({savingsPercent}%)
              </Badge>
            </div>
          )}

          {/* FOMO Countdown */}
          <div className="mb-3 text-xs text-orange-600 font-semibold">
            ⏰ Price expires in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>

          {/* Trust Signals */}
          <div className="mb-3 space-y-1 text-xs text-gray-600">
            <div>✓ No dealer fees</div>
            <div>✓ Price locked 24h</div>
          </div>

          {/* CTA - Full Width, Big */}
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-bold rounded-lg">
            Get This Deal →
          </Button>
        </div>
        </div>
      </Link>
    </div>
  );
};

export default OfferCard;
