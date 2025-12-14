import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Trash2, Edit2, Instagram, ExternalLink, GripVertical } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VideoReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    instagramUrl: '',
    title: '',
    likes: 0,
    comments: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/admin/video-reviews`);
      const data = await response.json();
      
      if (data.ok) {
        setReviews(data.reviews);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingReview 
        ? `${BACKEND_URL}/api/admin/video-reviews/${editingReview.id}`
        : `${BACKEND_URL}/api/admin/video-reviews`;
      
      const method = editingReview ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await fetchReviews();
        resetForm();
        alert(editingReview ? 'Отзыв обновлён!' : 'Отзыв добавлен!');
      } else {
        alert(data.detail || 'Ошибка');
      }
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Удалить этот отзыв?')) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/video-reviews/${reviewId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.ok) {
        await fetchReviews();
        alert('Отзыв удалён!');
      } else {
        alert(data.detail || 'Ошибка');
      }
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      instagramUrl: review.instagramUrl,
      title: review.title,
      likes: review.likes || 0,
      comments: review.comments || 0
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      instagramUrl: '',
      title: '',
      likes: 0,
      comments: 0
    });
    setEditingReview(null);
    setShowAddForm(false);
  };

  const extractReelId = (url) => {
    const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Видео-отзывы</h1>
          <p className="text-gray-600 mt-1">
            Управление Instagram Reels отзывами
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить отзыв
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Всего отзывов</div>
            <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Всего лайков</div>
            <div className="text-3xl font-bold text-pink-600">
              {reviews.reduce((sum, r) => sum + (r.likes || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Всего комментариев</div>
            <div className="text-3xl font-bold text-blue-600">
              {reviews.reduce((sum, r) => sum + (r.comments || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingReview ? 'Редактировать отзыв' : 'Добавить новый отзыв'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Reel URL *
                </label>
                <Input
                  type="text"
                  placeholder="https://www.instagram.com/reel/..."
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  required
                  disabled={!!editingReview}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Пример: https://www.instagram.com/reel/DR6hz9Akfqt/
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название отзыва *
                </label>
                <Input
                  type="text"
                  placeholder="Реальный отзыв клиента о покупке авто"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лайки
                  </label>
                  <Input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарии
                  </label>
                  <Input
                    type="number"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  {editingReview ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Preview */}
              <div className="aspect-[9/16] bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                <iframe
                  src={review.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  title={review.title}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 text-gray-900">
                    #{index + 1}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {review.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>❤️ {review.likes?.toLocaleString() || 0}</span>
                <span>💬 {review.comments || 0}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <a href={review.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4 mr-1" />
                    Открыть
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(review)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(review.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Reel ID */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  ID: {review.id}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && !showAddForm && (
        <div className="text-center py-20">
          <Instagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Нет видео-отзывов
          </h3>
          <p className="text-gray-600 mb-6">
            Добавьте первый отзыв, нажав кнопку "Добавить отзыв"
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoReviewsManager;
