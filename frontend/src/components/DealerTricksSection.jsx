import React from 'react';
import { Shield, DollarSign, Clock, Users, Award, Lock } from 'lucide-react';

const DealerTricksSection = () => {
  const tricks = [
    { pain: 'Hidden add-ons ($1,500-3,000)', solution: 'Zero add-ons. Ever.', icon: DollarSign },
    { pain: 'Marked up interest rates', solution: 'Direct bank rates. No markup.', icon: Shield },
    { pain: 'Dealer doc fees ($500-1,200)', solution: 'All fees disclosed upfront', icon: Lock },
    { pain: 'Bait-and-switch pricing', solution: 'Price locked 24 hours', icon: Award },
    { pain: 'Pressure tactics', solution: '100% online. Zero pressure.', icon: Users },
    { pain: '4+ hour dealership visits', solution: 'Apply in 3 minutes', icon: Clock },
    { pain: 'Fake limited time offers', solution: 'Real expiry dates shown', icon: Clock },
    { pain: 'Warranty upselling', solution: 'Standard warranty included', icon: Shield },
    { pain: 'Finance office manipulation', solution: 'No finance office. Just facts.', icon: Lock },
    { pain: 'Post-negotiation fees', solution: 'Final price IS final price', icon: Award }
  ];

  return (
    <section className="py-11 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Why Traditional Dealers Cost You $3,000–7,000 More
          </h2>
          <p className="text-lg text-gray-600">
            Here are the 10 tricks we eliminated to save you money
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {tricks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="flex-shrink-0 w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-red-600 font-semibold text-xs mb-0.5 line-through">
                      {item.pain}
                    </div>
                    <div className="text-green-700 font-bold text-xs">
                      ✓ {item.solution}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealerTricksSection;
