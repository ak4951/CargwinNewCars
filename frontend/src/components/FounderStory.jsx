import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Shield, DollarSign, Clock, Users, Award, Lock } from 'lucide-react';

const FounderStory = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Hunter.Lease Exists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One immigrant's mission to end car dealer manipulation in America
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Founder Photo */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src="https://scontent-sjc3-1.cdninstagram.com/v/t51.29350-15/471993289_18480155309039832_7962906598925673974_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=fEq7vXH0-OkQ7kNvgHBqJYi&_nc_gid=67c8e3e3e3e3e3e3e3e3e3e3&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MzU1MjE1MjE1MjE1MjE1MjE1.2-ccb7-5&oh=00_AYCxQxQxQxQxQxQxQxQxQxQxQxQ&oe=676F8E3C&_nc_sid=22de04"
                alt="Azat - Founder of Hunter.Lease"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=600";
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">Founder & CEO</div>
                <div className="text-2xl font-bold">Azat Reed</div>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="order-1 lg:order-2">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-6">
              <p className="text-lg italic text-gray-800 leading-relaxed">
                "When I moved to the US, I was shocked. Dealers manipulated customers, added hidden fees, inflated rates... 
                I knew there had to be a better way."
              </p>
              <p className="text-sm text-gray-600 mt-4">
                — Azat Reed, Founder
              </p>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                As an immigrant, my first car buying experience in America was a nightmare. 
                The dealer added <strong>$4,500 in "fees"</strong> I never agreed to, 
                raised my interest rate because I didn't notice, and pressured me into warranties I didn't need.
              </p>
              
              <p className="text-lg leading-relaxed">
                I realized: <strong className="text-red-600">millions of Americans overpay $3,000-7,000 on every car</strong> — 
                not because they're bad negotiators, but because the system is rigged against them.
              </p>

              <p className="text-lg leading-relaxed font-semibold text-gray-900">
                So I created Hunter.Lease — direct access to fleet pricing that rental companies and taxi fleets get. 
                No dealer markup. No add-ons. No games.
              </p>
            </div>
          </div>
        </div>

        {/* 10 Pain Points → Solutions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            10 Dealer Tricks We Eliminated
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                pain: "Hidden add-ons ($1,500-3,000)",
                solution: "Zero add-ons. Ever.",
                icon: DollarSign
              },
              {
                pain: "Marked up interest rates",
                solution: "Direct bank rates. No markup.",
                icon: Shield
              },
              {
                pain: "Dealer doc fees ($500-1,200)",
                solution: "All fees disclosed upfront",
                icon: Lock
              },
              {
                pain: "Bait-and-switch pricing",
                solution: "Price locked 24 hours",
                icon: Award
              },
              {
                pain: "Pressure tactics",
                solution: "100% online. Zero pressure.",
                icon: Users
              },
              {
                pain: "4+ hour dealership visits",
                solution: "Apply in 3 minutes",
                icon: Clock
              },
              {
                pain: "Fake \"limited time\" offers",
                solution: "Real expiry dates shown",
                icon: Clock
              },
              {
                pain: "Warranty upselling",
                solution: "Standard warranty included",
                icon: Shield
              },
              {
                pain: "Finance office manipulation",
                solution: "No finance office. Just facts.",
                icon: Lock
              },
              {
                pain: "Post-negotiation fees",
                solution: "Final price IS final price",
                icon: Award
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-red-600 font-semibold mb-1 line-through">
                      {item.pain}
                    </div>
                    <div className="text-green-700 font-bold">
                      ✓ {item.solution}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How We Work With Dealers */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-3xl font-bold mb-6">
            "But Why Would Dealers Work With You?"
          </h3>
          
          <div className="space-y-4 text-lg">
            <p className="leading-relaxed">
              <strong className="text-yellow-400">Great question.</strong> We don't work with retail dealers. 
              We work directly with <strong>wholesale/fleet departments</strong> at Toyota, Lexus, Honda, Kia, BMW — 
              the same teams that supply:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚕</div>
                <div className="text-sm">Uber/Lyft Fleets</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚗</div>
                <div className="text-sm">Enterprise Rental</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🏢</div>
                <div className="text-sm">Corporate Fleets</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm">YOU (Now!)</div>
              </div>
            </div>

            <p className="leading-relaxed">
              These departments <strong>love volume</strong>. They don't care about squeezing every dollar out of you. 
              They care about moving inventory fast. That's why they give us the same rates they give Hertz and Enterprise.
            </p>

            <p className="text-yellow-400 font-bold text-xl">
              You're not buying from a dealer. You're buying from the source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
