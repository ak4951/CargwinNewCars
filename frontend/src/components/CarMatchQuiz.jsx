import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';

const CarMatchQuiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    { q: "What is most important to you?", options: [{ text: 'Lowest monthly payment', value: 'price', filter: 'budgetMax=400' }, { text: 'Fuel efficiency', value: 'efficiency', filter: 'fuelType=hybrid' }, { text: 'Luxury & comfort', value: 'luxury', filter: 'brand=lexus' }, { text: 'Family space', value: 'space', filter: 'bodyType=suv' }] },
    { q: 'How do you plan to use this car?', options: [{ text: 'Daily commute', value: 'commute', filter: 'fuelType=hybrid' }, { text: 'Family trips', value: 'family', filter: 'bodyType=suv' }, { text: 'Weekend fun', value: 'fun', filter: 'dealType=lease' }, { text: 'Business/Uber', value: 'business', filter: 'mileage=15000' }] },
    { q: 'Your monthly budget?', options: [{ text: 'Under $300', value: '300', filter: 'budgetMax=300' }, { text: '$300-400', value: '400', filter: 'budgetMax=400' }, { text: '$400-600', value: '600', filter: 'budgetMax=600' }, { text: '$600+ (Luxury)', value: '800', filter: 'budgetMin=600' }] }
  ];

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQ]: option };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      const recommendations = { price: { car: 'Toyota Camry', payment: '$280/mo', savings: '$5,200' }, efficiency: { car: 'Toyota Prius', payment: '$310/mo', savings: '$4,800' }, luxury: { car: 'Lexus ES350', payment: '$520/mo', savings: '$7,100' }, space: { car: 'Honda Pilot', payment: '$480/mo', savings: '$6,200' } };
      const mainPriority = newAnswers[0]?.value || 'price';
      setResult(recommendations[mainPriority]);
    }
  };

  const viewMatches = () => {
    const filters = Object.values(answers).map(a => a.filter).join('&');
    navigate(`/deals?${filters}`);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Car Match</h2>
          <p className="text-base text-gray-600">Answer 3 quick questions and we will show you the best deals</p>
        </div>

        <Card className="shadow-xl"><CardContent className="p-6">
          {!result ? (
            <div>
              <div className="mb-5"><div className="flex justify-between text-xs text-gray-600 mb-1.5"><span>Question {currentQ + 1} of {questions.length}</span><span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-red-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} /></div></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{questions[currentQ].q}</h3>
              <div className="space-y-2">
                {questions[currentQ].options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(option)} className="w-full text-left p-3 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all group">
                    <div className="flex items-center justify-between"><span className="text-base text-gray-900 group-hover:text-red-600 font-medium">{option.text}</span><CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-red-600" /></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4"><div className="text-green-600 text-4xl mb-3">✓</div><h3 className="text-xl font-bold text-gray-900 mb-1">Perfect Match Found!</h3></div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4"><div className="text-sm text-gray-600 mb-1">We recommend</div><div className="text-2xl font-bold text-gray-900 mb-2">{result.car}</div><div className="text-xl font-bold text-red-600">{result.payment}</div><div className="text-xs text-green-600 font-semibold mt-1">Save {result.savings} vs dealer</div></div>
              <Button onClick={viewMatches} className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base">View Matching Deals</Button>
            </div>
          )}
        </CardContent></Card>
      </div>
    </section>
  );
};

export default CarMatchQuiz;