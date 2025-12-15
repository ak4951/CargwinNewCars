import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Shield, DollarSign, Clock, Users, Award, Lock } from 'lucide-react';

const FounderStory = () => {
  return (
    <section className="py-11 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Hunter.Lease Exists</h2>
          <p className="text-lg text-gray-600">One immigrant's mission to end car dealer manipulation in America</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img src="https://scontent-sjc3-1.cdninstagram.com/v/t51.29350-15/471993289_18480155309039832_7962906598925673974_n.jpg" alt="Azat - Founder" className="rounded-2xl shadow-2xl w-full" onError={(e) => { e.target.src = "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=600"; }} />
              <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"><div className="text-xs font-semibold">Founder & CEO</div><div className="text-lg font-bold">Azat Reed</div></div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-4">
              <p className="text-base italic text-gray-800 leading-relaxed">&quot;When I moved to the US, I was shocked. Dealers manipulated customers, added hidden fees, inflated rates... I knew there had to be a better way.&quot;</p>
              <p className="text-xs text-gray-600 mt-2">— Azat Reed, Founder</p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="text-base leading-relaxed">As an immigrant, my first car buying experience in America was a nightmare. The dealer added <strong>$4,500 in fees</strong> I never agreed to, raised my interest rate, and pressured me into warranties I did not need.</p>
              <p className="text-base leading-relaxed"><strong className="text-red-600">Millions of Americans overpay $3,000-7,000 on every car</strong> — not because they are bad negotiators, but because the system is rigged.</p>
              <p className="text-base leading-relaxed font-semibold text-gray-900">So I created Hunter.Lease — direct access to fleet pricing that rental companies get. No dealer markup. No add-ons. No games.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 text-center">10 Dealer Tricks We Eliminated</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {[
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
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="flex-shrink-0 w-9 h-9 bg-red-100 rounded-full flex items-center justify-center"><Icon className="w-4 h-4 text-red-600" /></div>
                  <div><div className="text-red-600 font-semibold text-xs mb-0.5 line-through">{item.pain}</div><div className="text-green-700 font-bold text-xs">✓ {item.solution}</div></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">But Why Would Dealers Work With You?</h3>
          <div className="space-y-3 text-base">
            <p><strong className="text-yellow-400">Great question.</strong> We work directly with <strong>wholesale/fleet departments</strong> at Toyota, Lexus, Honda, Kia, BMW — the same teams that supply:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
              {['🚕 Uber/Lyft Fleets', '🚗 Enterprise Rental', '🏢 Corporate Fleets', '👤 YOU (Now!)'].map((t, i) => <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center text-sm">{t}</div>)}
            </div>
            <p>These departments <strong>love volume</strong>. They care about moving inventory fast. That is why they give us the same rates they give Hertz and Enterprise.</p>
            <p className="text-yellow-400 font-bold text-lg">You are not buying from a dealer. You are buying from the source.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;