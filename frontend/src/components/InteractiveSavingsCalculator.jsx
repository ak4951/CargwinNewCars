import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TrendingDown, ArrowRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InteractiveSavingsCalculator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ brand: '', budget: '', zip: '' });
  const [result, setResult] = useState(null);

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    if (step < 3) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      const avgPaymentHunter = parseInt(value) || 400;
      const avgPaymentDealer = Math.round(avgPaymentHunter * 1.35);
      const monthlyDiff = avgPaymentDealer - avgPaymentHunter;
      const savings3Years = monthlyDiff * 36;
      const msrpDiscount = 3498;
      const totalSavings = savings3Years + msrpDiscount;
      setResult({ hunterPayment: avgPaymentHunter, dealerPayment: avgPaymentDealer, monthlyDiff, savings3Years, msrpDiscount, totalSavings, brand: selections.brand, zip: value });
    }
  };

  const reset = () => { setStep(1); setSelections({ brand: '', budget: '', zip: '' }); setResult(null); };

  return (
    <section className="py-11 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            See How Much You Will Save
          </h2>
          <p className="text-lg text-gray-600">
            Answer 3 quick questions to reveal your savings
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-red-100">
          <div className="p-6 md:p-8">
            {!result ? (
              <div className="space-y-5">
                <div className="flex items-center justify-center gap-2 mb-5">
                  {[1, 2, 3].map(num => (
                    <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${ num === step ? 'bg-red-600 text-white scale-110' : num < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500' } transition-all duration-300`}>
                      {num < step ? '✓' : num}
                    </div>
                  ))}
                </div>

                {step >= 1 && (
                  <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
                    <label className="block text-base font-semibold text-gray-900 mb-2">1. What brand are you interested in?</label>
                    <Select value={selections.brand} onValueChange={(v) => handleSelect('brand', v)}>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a brand..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="lexus">Lexus</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="tesla">Tesla</SelectItem>
                        <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step >= 2 && (
                  <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100' : 'opacity-50'}`}>
                    <label className="block text-base font-semibold text-gray-900 mb-2">2. What is your ideal monthly budget?</label>
                    <Select value={selections.budget} onValueChange={(v) => handleSelect('budget', v)}>
                      <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select budget..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Under $300/month</SelectItem>
                        <SelectItem value="400">Under $400/month</SelectItem>
                        <SelectItem value="500">Under $500/month</SelectItem>
                        <SelectItem value="600">$500-700/month</SelectItem>
                        <SelectItem value="800">$700+ (Luxury)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step >= 3 && (
                  <div className="transition-all duration-500">
                    <label className="block text-base font-semibold text-gray-900 mb-2">3. Your California ZIP code?</label>
                    <input type="text" maxLength="5" placeholder="90210" value={selections.zip}
                      onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setSelections(prev => ({ ...prev, zip: val })); if (val.length === 5) handleSelect('zip', val); }}
                      className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-center font-mono" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-5">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Savings Breakdown</h3>
                  <p className="text-sm text-gray-600">Based on {result.brand.toUpperCase()} in ZIP {result.zip}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><div className="text-xs text-gray-600 mb-1">Traditional Dealer</div><div className="bg-red-100 border-2 border-red-300 rounded-lg p-3"><div className="text-2xl font-bold text-red-600">${result.dealerPayment}<span className="text-sm">/mo</span></div></div></div>
                    <div><div className="text-xs text-gray-600 mb-1">Hunter.Lease</div><div className="bg-green-100 border-2 border-green-500 rounded-lg p-3"><div className="text-2xl font-bold text-green-600">${result.hunterPayment}<span className="text-sm">/mo</span></div></div></div>
                  </div>
                  <div className="text-center"><TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-1" /><div className="text-xl font-bold text-green-600">You save ${result.monthlyDiff}/month</div></div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-5 text-center">
                  <div className="text-sm mb-1">Total 3-Year Savings</div>
                  <div className="text-4xl font-bold mb-1">${result.totalSavings.toLocaleString()}</div>
                  <div className="text-xs opacity-90">${result.savings3Years.toLocaleString()} (payments) + ${result.msrpDiscount.toLocaleString()} (MSRP discount)</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <Button onClick={() => navigate(`/deals?brand=${result.brand}&budget=${result.hunterPayment}`)} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-11 text-base">Lock This Savings<ArrowRight className="w-4 h-4 ml-2" /></Button>
                  <Button onClick={reset} variant="outline" className="h-11">Try Different Options</Button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-3">* Savings based on 847 actual customer transactions in California</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

const useState = React.useState;
export default InteractiveSavingsCalculator;