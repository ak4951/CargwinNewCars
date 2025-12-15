import React from 'react';
import { Shield, DollarSign, Zap, Award } from 'lucide-react';

const GuaranteesBar = () => {
  const guarantees = [
    { icon: DollarSign, title: 'Lowest Price Guarantee', subtitle: 'Beat any dealer quote' },
    { icon: Shield, title: 'Price Locked 24h', subtitle: 'No bait & switch' },
    { icon: Zap, title: '3-Minute Application', subtitle: 'Skip the dealership' },
    { icon: Award, title: '4.9★ Rated', subtitle: '847 verified reviews' }
  ];

  return (
    <section className="bg-white py-5 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-gray-600 leading-tight">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuaranteesBar;