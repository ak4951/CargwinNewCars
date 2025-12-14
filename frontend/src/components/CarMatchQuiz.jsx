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
    {
      q: "What is most important to you?",
      options: [
        { text: 'Lowest monthly payment', value: 'price', filter: 'budgetMax=400' },
        { text: 'Fuel efficiency', value: 'efficiency', filter: 'fuelType=hybrid' },
        { text: 'Luxury & comfort', value: 'luxury', filter: 'brand=lexus' },
        { text: 'Family space', value: 'space', filter: 'bodyType=suv' }
      ]
    },
    {
      q: 'How do you plan to use this car?',
      options: [
        { text: 'Daily commute', value: 'commute', filter: 'fuelType=hybrid' },
        { text: 'Family trips', value: 'family', filter: 'bodyType=suv' },
        { text: 'Weekend fun', value: 'fun', filter: 'dealType=lease' },
        { text: 'Business/Uber', value: 'business', filter: 'mileage=15000' }
      ]
    },
    {
      q: 'Your monthly budget?',
      options: [
        { text: 'Under $300', value: '300', filter: 'budgetMax=300' },
        { text: '$300-400', value: '400', filter: 'budgetMax=400' },
        { text: '$400-600', value: '600', filter: 'budgetMax=600' },
        { text: '$600+ (Luxury)', value: '800', filter: 'budgetMin=600' }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQ]: option };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const recommendations = {
      price: { car: 'Toyota Camry', payment: '$280/mo', savings: '$5,200' },
      efficiency: { car: 'Toyota Prius', payment: '$310/mo', savings: '$4,800' },
      luxury: { car: 'Lexus ES350', payment: '$520/mo', savings: '$7,100' },
      space: { car: 'Honda Pilot', payment: '$480/mo', savings: '$6,200' }
    };

    const mainPriority = finalAnswers[0]?.value || 'price';
    setResult(recommendations[mainPriority]);
  };

  const viewMatches = () => {
    const filters = Object.values(answers).map(a => a.filter).join('&');
    navigate(`/deals?${filters}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Car Match
          </h2>
          <p className="text-lg text-gray-600">
            Answer 3 quick questions and we'll show you the best deals
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            {!result ? (
              <div>
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {questions[currentQ].q}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQ].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-900 group-hover:text-red-600 font-medium">
                          {option.text}
                        </span>
                        <CheckCircle2 className="w-6 h-6 text-gray-300 group-hover:text-red-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Result */
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Perfect Match Found!
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
                  <div className="text-lg text-gray-600 mb-2">We recommend</div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    {result.car}
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.payment}
                  </div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Save {result.savings} vs dealer
                  </div>
                </div>

                <Button
                  onClick={viewMatches}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                >
                  View Matching Deals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CarMatchQuiz;