import React from 'react';

const WhyDealersWorkWithUs = () => {
  return (
    <section className="py-9 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center">
            But Why Would Dealers Work With You?
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-3 text-base">
            <p className="leading-relaxed">
              <strong className="text-yellow-400">Great question.</strong> We do not work with retail dealers. 
              We work directly with <strong>wholesale/fleet departments</strong> at Toyota, Lexus, Honda, Kia, BMW — 
              the same teams that supply:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
              {['🚕 Uber/Lyft Fleets', '🚗 Enterprise Rental', '🏢 Corporate Fleets', '👤 YOU (Now!)'].map((t, i) => 
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center text-sm">{t}</div>
              )}
            </div>

            <p className="leading-relaxed">
              These departments <strong>love volume</strong>. They do not care about squeezing every dollar out of you. 
              They care about moving inventory fast. That is why they give us the same rates they give Hertz and Enterprise.
            </p>

            <p className="text-yellow-400 font-bold text-lg mt-4">
              You are not buying from a dealer. You are buying from the source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDealersWorkWithUs;
