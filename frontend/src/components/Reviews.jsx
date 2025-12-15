import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, DollarSign, Instagram, ExternalLink } from 'lucide-react';
import { mockReviews } from '../mock';
import { formatPrice } from '../utils/timer';
import { useI18n } from '../hooks/useI18n';
import InstagramReelsPlayer from './InstagramReelsPlayer';

const Reviews = () => {
  const { t } = useI18n();
  const [videoReviews, setVideoReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchVideoReviews();
  }, []);

  const fetchVideoReviews = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/video-reviews`);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setVideoReviews(data);
      }
    } catch (error) {
      console.error('Error fetching video reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="reviews" className="py-11 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
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

        {/* Video Reviews - Instagram Reels */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('reviews.instagram_title')}
            </h3>
            <p className="text-gray-600 text-base max-w-2xl mx-auto mb-2">
              Смотрите реальные истории наших клиентов
            </p>
            {videoReviews.length > 0 && (
              <p className="text-sm text-gray-500">
                📱 {videoReviews.length} видео-отзыв{videoReviews.length > 1 ? 'ов' : ''} — листайте как в Instagram
              </p>
            )}
          </div>

          {/* Instagram Reels Player */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : videoReviews.length > 0 ? (
            <div className="flex justify-center">
              <InstagramReelsPlayer reels={videoReviews} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Instagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Скоро здесь появятся видео-отзывы
              </p>
            </div>
          )}

          {/* Instagram Link Below */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4 text-sm">
              Подписывайтесь на наш Instagram, чтобы не пропустить новые отзывы
            </p>
            <Button
              asChild
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50"
            >
              <a 
                href="https://www.instagram.com/hunterlease/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                @hunterlease
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