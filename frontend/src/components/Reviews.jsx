import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, DollarSign, Instagram, ExternalLink } from 'lucide-react';
import { mockReviews, mockInstagramReviews, mockVideoReviews } from '../mock';
import { formatPrice } from '../utils/timer';
import { useI18n } from '../hooks/useI18n';
import VerticalVideoPlayer from './VerticalVideoPlayer';

const Reviews = () => {
  const { t } = useI18n();
  
  return (
    <section id="reviews" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Text Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockReviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Savings Highlight */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">
                      {t('reviews.saved')}: {formatPrice(review.savings)}
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {review.model}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.city}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Подтверждён
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Reviews - Embedded Player */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('reviews.instagram_title')}
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Смотрите реальные истории наших клиентов прямо здесь
            </p>
          </div>

          {/* Vertical Video Player */}
          <div className="flex justify-center">
            <VerticalVideoPlayer videos={mockVideoReviews} autoPlayOnView={true} />
          </div>

          {/* Instagram Link Below */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Больше отзывов в нашем Instagram
            </p>
            <Button
              asChild
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50"
            >
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Подписаться на @hunter.lease
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">
                4.9/5
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {t('reviews.average_rating')}
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                847
              </div>
              <div className="text-sm text-gray-600">
                {t('reviews.reviews_per_month')}
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                96%
              </div>
              <div className="text-sm text-gray-600">
                {t('reviews.recommend_friends')}
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                $5,200
              </div>
              <div className="text-sm text-gray-600">
                {t('reviews.average_savings')}
              </div>
            </div>
          </div>
        </div>

        {/* Review CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('reviews.share_experience')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('reviews.help_others')}
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              {t('reviews.leave_review')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;