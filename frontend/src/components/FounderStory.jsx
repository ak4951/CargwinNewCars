import React from 'react';

const FounderStory = () => {
  return (
    <section className="py-11 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            After Seeing This System From The Inside, I Knew It Had To Change
          </h2>
          <p className="text-lg text-gray-600">The story behind Hunter.Lease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          {/* Photo - Smaller, 2 columns */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="relative max-w-xs mx-auto">
              <img
                src="https://scontent-sjc3-1.cdninstagram.com/v/t51.29350-15/471993289_18480155309039832_7962906598925673974_n.jpg"
                alt="Azat Reed - Founder"
                className="rounded-2xl shadow-xl w-full object-cover"
                style={{ maxHeight: '320px', aspectRatio: '3/4' }}
                onError={(e) => { 
                  e.target.src = "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=600"; 
                }}
              />
              <div className="absolute -bottom-3 -right-3 bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg">
                <div className="text-xs font-semibold">Founder</div>
                <div className="text-base font-bold">Azat Reed</div>
              </div>
            </div>
          </div>

          {/* Text - 3 columns */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-4">
              <p className="text-base italic text-gray-800 leading-snug">
                &quot;When I moved to the US, I was shocked. Dealers manipulated customers, added hidden fees, inflated rates... I knew there had to be a better way.&quot;
              </p>
              <p className="text-xs text-gray-600 mt-2">&mdash; Azat Reed</p>
            </div>
            
            <div className="space-y-2.5 text-gray-700">
              <p className="text-base leading-relaxed">
                As an immigrant, my first car buying experience in America was a nightmare. 
                The dealer added <strong>$4,500 in fees</strong> I never agreed to, raised my interest rate, and pressured me into warranties I did not need.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong className="text-red-600">Millions of Americans overpay $3,000-7,000 on every car</strong> &mdash; 
                not because they are bad negotiators, but because the system is rigged.
              </p>

              <p className="text-base leading-relaxed font-semibold text-gray-900">
                So I created Hunter.Lease &mdash; direct access to fleet pricing that rental companies get. 
                No dealer markup. No add-ons. No games.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
