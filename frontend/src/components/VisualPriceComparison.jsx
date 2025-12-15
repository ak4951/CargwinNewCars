import React from 'react';
import { Card, CardContent } from './ui/card';
import { Check, X, DollarSign } from 'lucide-react';

const VisualPriceComparison = () => {
  const comparison = [
    { name: 'Hunter.Lease', tagline: 'Fleet Pricing', monthly: 320, down: 500, fees: 0, total3yr: 12020, color: 'green', features: [{ text: 'Fleet pricing', included: true }, { text: 'Zero dealer markup', included: true }, { text: 'No add-ons', included: true }, { text: 'Transparent fees', included: true }, { text: 'Online application', included: true }, { text: 'Free delivery', included: true }] },
    { name: 'AutoBandit', tagline: 'Aggregator', monthly: 380, down: 750, fees: 200, total3yr: 14630, color: 'yellow', features: [{ text: 'Negotiated pricing', included: true }, { text: 'Some markup', included: false }, { text: 'Minimal add-ons', included: true }, { text: 'Most fees shown', included: true }, { text: 'Online application', included: true }, { text: 'Delivery (paid)', included: false }] },
    { name: 'Dealer', tagline: 'Traditional', monthly: 450, down: 2500, fees: 1500, total3yr: 20700, color: 'red', features: [{ text: 'MSRP pricing', included: false }, { text: 'Heavy dealer markup', included: false }, { text: 'Forced add-ons', included: false }, { text: 'Hidden fees', included: false }, { text: 'In-person only', included: false }, { text: 'No delivery', included: false }] }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Here's Why Our Prices Are Lower Than Anywhere Else in California
          </h2>
          <p className="text-lg text-gray-600">Real numbers. Real savings. Real transparency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {comparison.map((option, idx) => (
            <Card key={idx} className={`relative overflow-hidden transition-all ${ option.color === 'green' ? 'border-4 border-green-500 shadow-2xl scale-105' : 'border-2 border-gray-200 hover:shadow-lg' }`}>
              {option.color === 'green' && <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-1.5 text-xs font-bold">⭐ BEST VALUE - Save ${(20700 - option.total3yr).toLocaleString()}</div>}
              <CardContent className={`p-4 ${option.color === 'green' ? 'pt-10' : ''}`}>
                <div className="text-center mb-4"><h3 className="text-xl font-bold text-gray-900 mb-0.5">{option.name}</h3><p className="text-xs text-gray-500">{option.tagline}</p></div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="text-center mb-3"><div className="text-3xl font-bold text-gray-900">${option.monthly}<span className="text-base text-gray-600">/mo</span></div></div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-600">Down payment:</span><span className="font-semibold">${option.down}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Hidden fees:</span><span className={`font-semibold ${option.fees === 0 ? 'text-green-600' : 'text-red-600'}`}>${option.fees}</span></div>
                    <div className="border-t pt-1.5 mt-1.5"><div className="flex justify-between"><span className="text-gray-900 font-bold">3-Year Total:</span><span className="text-lg font-bold">${option.total3yr.toLocaleString()}</span></div></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {option.features.map((f, i) => <div key={i} className="flex items-center gap-1.5">{f.included ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" /> : <X className="w-4 h-4 text-red-500 flex-shrink-0" />}<span className={`text-xs ${ f.included ? 'text-gray-700' : 'text-gray-400 line-through' }`}>{f.text}</span></div>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center"><div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2"><DollarSign className="w-4 h-4 text-green-600" /><span className="text-green-800 font-semibold text-sm">Average Hunter.Lease customer saves <span className="text-green-600 font-bold text-lg">$10,360</span> over 3 years</span></div></div>
      </div>
    </section>
  );
};

export default VisualPriceComparison;