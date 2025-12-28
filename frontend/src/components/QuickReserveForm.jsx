import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Shield, Clock, Award } from 'lucide-react';

const QuickReserveForm = ({ carData }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          carId: carData.id,
          carTitle: `${carData.year} ${carData.make} ${carData.model}`,
          monthlyPayment: carData.monthlyPayment
        })
      });
      
      if (response.ok) {
        alert('✅ Reserved! Check your email for next steps.');
        setFormData({ name: '', phone: '', email: '' });
      } else {
        alert('❌ Reservation failed. Please try again.');
      }
    } catch (error) {
      alert('❌ Error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const payment = carData.monthlyPayment || carData.lease?.monthly || 0;
  const discount = carData.discount || 0;

  return (
    <Card className="sticky top-20 shadow-2xl border-2 border-red-500">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Lock This Price</div>
          <div className="text-4xl font-bold text-red-600">
            ${payment}
            <span className="text-xl text-gray-600">/mo</span>
          </div>
          {discount > 0 && (
            <div className="text-green-600 font-semibold mt-1">
              Save ${discount.toLocaleString()} vs MSRP
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="h-11"
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="h-11"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-bold"
          >
            {submitting ? 'Processing...' : 'Reserve Now - $99 Deposit'}
          </Button>
        </form>

        <div className="mt-4 space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>$99 fully refundable if dealer cannot honor</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Locks price for 48 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Soft credit check only (no score impact)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReserveForm;
