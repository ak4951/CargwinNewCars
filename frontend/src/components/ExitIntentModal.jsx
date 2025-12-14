import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Zap, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ExitIntentModal = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setShow(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save email to DB
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      await fetch(`${BACKEND_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.error('Subscription error:', err);
    }

    setShow(false);
    alert('✅ Subscribed! We will notify you of the best deals.');
  };

  const handleViewBestOffer = () => {
    setShow(false);
    navigate('/deals?sort=savings');
  };

  if (!show) return null;

  const isDealsPage = location.pathname.includes('/deals');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slide-up">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {isDealsPage ? (
          /* On Deals Page - Best Offer CTA */
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Before You Go...
            </h3>
            <p className="text-gray-600 mb-6">
              Check out our <strong className="text-red-600">highest-savings deal</strong> — 
              customers save an average of <strong>$8,500</strong> on this one.
            </p>
            <Button
              onClick={handleViewBestOffer}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 mb-3"
            >
              Show Me The Best Offer
            </Button>
            <button
              onClick={() => setShow(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              No thanks, I'll browse myself
            </button>
          </div>
        ) : (
          /* Other Pages - Newsletter Signup */
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Do not Miss Out!
            </h3>
            <p className="text-gray-600 mb-6">
              New deals drop every week. Get notified when we find <strong>your perfect car</strong> at fleet pricing.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-center"
              />
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
              >
                Notify Me of Best Deals
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              97% of visitors who leave never come back. Do not be one of them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitIntentModal;