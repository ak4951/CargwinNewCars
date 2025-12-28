import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, Clock, Wifi, ArrowRight, Shield, Award, MapPin, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

const OfferV2 = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 14, minutes: 32, seconds: 18 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [liveStats, setLiveStats] = useState({ viewing: 2, recentActivity: 'Sarah from Los Angeles' });

  useEffect(() => {
    fetchCarData();
    
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 0; minutes = 0; seconds = 0; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    const liveInterval = setInterval(() => {
      const names = ['Sarah', 'Michael', 'Jessica', 'David', 'Emma'];
      const cities = ['Los Angeles', 'San Francisco', 'San Diego', 'Irvine'];
      setLiveStats({
        viewing: Math.floor(Math.random() * 3) + 1,
        recentActivity: `${names[Math.floor(Math.random() * names.length)]} from ${cities[Math.floor(Math.random() * cities.length)]}`
      });
    }, 8000);
    
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(countdownInterval);
      clearInterval(liveInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [carId]);

  const fetchCarData = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/cars/${carId}`);
      if (response.ok) {
        const data = await response.json();
        setCarData(data);
      } else {
        setCarData(null);
      }
    } catch (error) {
      setCarData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    alert('✅ Reserved! Check your email for next steps.');
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

  if (!carData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <Button onClick={() => navigate('/deals')} className="bg-red-600 hover:bg-red-700">View All Deals</Button>
          </div>
        </div>
      </div>
    );
  }

  const payment = carData.monthlyPayment || carData.lease?.monthly || 0;
  const dealerPrice = Math.round(payment * 1.35);
  const savings = dealerPrice - payment;
  const savings3yr = savings * 36;
  const stock = carData.stock || 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`Lock This Price: $${payment}/mo - ${carData.year} ${carData.make} ${carData.model}`}</title>
        <meta name="description" content={`Reserve this ${carData.year} ${carData.make} ${carData.model} for just $${payment}/month. Save $${savings3yr} over 3 years vs dealer pricing.`} />
      </Helmet>

      <Header />

      {/* Sticky CTA Bar */}
      {showStickyBar && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-red-600 shadow-xl z-50 py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={(carData.images && carData.images[0]) || carData.image} alt="" className="w-16 h-12 object-cover rounded" />
              <div>
                <div className="font-bold text-gray-900">{carData.year} {carData.make} {carData.model}</div>
                <div className="text-xl font-bold text-red-600">${payment}/mo</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">⏰ {timeRemaining.hours}h {timeRemaining.minutes}m left</div>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">Reserve Now - $99</Button>
            </div>
          </div>
        </div>
      )}

      {/* Scarcity Bar */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <div><div className="font-bold text-blue-600">{liveStats.viewing}</div><div className="text-xs text-gray-600">viewing now</div></div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <div><div className="font-bold text-red-600">{stock}</div><div className="text-xs text-gray-600">units left</div></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span><strong>{liveStats.recentActivity}</strong> just viewed this</span>
              <span className="text-gray-500">23 min ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Car Image + Info */}
            <div className="lg:col-span-2">
              <div className="relative mb-6">
                <img src={(carData.images && carData.images[0]) || carData.image} alt={`${carData.year} ${carData.make} ${carData.model}`} className="w-full rounded-2xl shadow-2xl" />
                
                {/* Urgency Badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <div><div className="text-xs">Price expires in</div><div className="text-lg font-bold">{timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s</div></div>
                  </div>
                </div>
                
                {/* Stock Badge */}
                {stock <= 3 && (
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold">
                    🔥 Only {stock} Left
                  </div>
                )}
              </div>
              
              {/* Improved Headline + Price Comparison */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold mb-3">✓ Verified Fleet Deal</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Lock This Price: ${payment}/mo</h1>
                    <p className="text-lg text-gray-600">{carData.year} {carData.make} {carData.model} {carData.trim}</p>
                  </div>
                  
                  {/* Price Comparison */}
                  <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-xl p-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">${payment}<span className="text-sm">/mo</span></div>
                      <div className="text-xs text-gray-600">Your Price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-400 line-through">${dealerPrice}</div>
                      <div className="text-xs text-gray-600">Dealer Price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">${savings3yr.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">You Save (3yr)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Proof */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-blue-900">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span><strong>127 people</strong> saved on this model in California</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Reserve Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-2xl border-2 border-red-500">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 mb-1">Lock This Price</div>
                    <div className="text-4xl font-bold text-red-600">${payment}<span className="text-xl text-gray-600">/mo</span></div>
                    {(carData.discount || 0) > 0 && <div className="text-green-600 font-semibold mt-1">Save ${(carData.discount || 0).toLocaleString()} vs MSRP</div>}
                  </div>

                  <form onSubmit={handleReserve} className="space-y-3">
                    <Input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="h-11" />
                    <Input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="h-11" />
                    <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="h-11" />
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-bold">Reserve Now - $99 Deposit</Button>
                  </form>

                  <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" /><span>$99 fully refundable if dealer cannot honor</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /><span>Locks price for 48 hours</span></div>
                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-purple-600" /><span>Soft credit check only (no score impact)</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Guarantees */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-4"><div className="text-2xl font-bold text-green-600">100%</div><div className="text-sm text-gray-600">Money Back Guarantee</div></div>
            <div className="bg-blue-50 rounded-lg p-4"><div className="text-2xl font-bold text-blue-600">24h</div><div className="text-sm text-gray-600">Price Lock</div></div>
            <div className="bg-purple-50 rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">3min</div><div className="text-sm text-gray-600">Application Time</div></div>
            <div className="bg-orange-50 rounded-lg p-4"><div className="text-2xl font-bold text-orange-600">4.9★</div><div className="text-sm text-gray-600">Customer Rating</div></div>
          </div>
        </div>
      </div>

      {/* What Happens After Reserve */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens After You Reserve?</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Soft Credit Check', desc: 'We verify your credit (no score impact)' },
              { step: 2, title: 'Dealer Confirmation', desc: 'We confirm availability within 24 hours' },
              { step: 3, title: 'Final Approval', desc: 'You get exact payment for YOUR credit tier' },
              { step: 4, title: 'E-Sign & Pickup', desc: 'Sign online, pickup in 24-48 hours' }
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow">
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{item.step}</div>
                <div><div className="font-bold text-gray-900">{item.title}</div><div className="text-sm text-gray-600">{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What happens after I reserve?', a: 'Within 24h: soft credit check, dealer confirmation, final offer with YOUR exact rate. You approve, then e-sign and pickup.' },
              { q: 'Is $99 refundable?', a: 'Yes, 100% refundable if dealer cannot honor the price or if you change your mind before signing.' },
              { q: 'When do I pay the rest?', a: 'At pickup. You can pay cash, get financing, or use our recommended lenders.' }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-900 mb-2">{faq.q}</div>
                <div className="text-sm text-gray-600">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OfferV2;
