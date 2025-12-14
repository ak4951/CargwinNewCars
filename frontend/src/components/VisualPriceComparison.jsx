import React from 'react';
import { Card, CardContent } from './ui/card';
import { Check, X, DollarSign } from 'lucide-react';

const VisualPriceComparison = () => {
  const comparison = [
    {
      name: 'Hunter.Lease',
      tagline: 'Fleet Pricing',
      monthly: 320,
      down: 500,
      fees: 0,
      total3yr: 12020,
      color: 'green',
      features: [
        { text: 'Fleet pricing', included: true },
        { text: 'Zero dealer markup', included: true },
        { text: 'No add-ons', included: true },
        { text: 'Transparent fees', included: true },
        { text: 'Online application', included: true },
        { text: 'Free delivery', included: true }
      ]
    },
    {
      name: 'AutoBandit',
      tagline: 'Aggregator',
      monthly: 380,
      down: 750,
      fees: 200,
      total3yr: 14630,
      color: 'yellow',
      features: [
        { text: 'Negotiated pricing', included: true },
        { text: 'Some markup', included: false },
        { text: 'Minimal add-ons', included: true },
        { text: 'Most fees shown', included: true },
        { text: 'Online application', included: true },
        { text: 'Delivery (paid)', included: false }
      ]
    },
    {
      name: 'Dealer',
      tagline: 'Traditional',
      monthly: 450,
      down: 2500,
      fees: 1500,
      total3yr: 20700,
      color: 'red',
      features: [
        { text: 'MSRP pricing', included: false },
        { text: 'Heavy dealer markup', included: false },
        { text: 'Forced add-ons', included: false },
        { text: 'Hidden fees', included: false },
        { text: 'In-person only', included: false },
        { text: 'No delivery', included: false }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See The Difference
          </h2>
          <p className="text-xl text-gray-600">
            Real numbers. Real savings. Real transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparison.map((option, idx) => (
            <Card
              key={idx}
              className={`relative overflow-hidden transition-all duration-300 ${
                option.color === 'green'
                  ? 'border-4 border-green-500 shadow-2xl scale-105'
                  : 'border-2 border-gray-200 hover:shadow-lg'
              }`}
            >
              {option.color === 'green' && (
                <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 text-sm font-bold">
                  ⭐ BEST VALUE - Save ${(20700 - option.total3yr).toLocaleString()}
                </div>
              )}

              <CardContent className={`p-6 ${option.color === 'green' ? 'pt-12' : ''}`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {option.name}
                  </h3>
                  <p className="text-sm text-gray-500">{option.tagline}</p>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-900">
                      ${option.monthly}
                      <span className="text-lg text-gray-600">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Down payment:</span>
                      <span className="font-semibold">${option.down}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hidden fees:</span>
                      <span className={`font-semibold ${option.fees === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${option.fees}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-bold">3-Year Total:</span>
                        <span className="text-xl font-bold">${option.total3yr.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-semibold">
              Average Hunter.Lease customer saves <span className="text-green-600 font-bold text-xl">$10,360</span> over 3 years
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualPriceComparison;