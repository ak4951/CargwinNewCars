import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Instagram, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const InstagramReelsPlayer = ({ reels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef(null);
  const startY = useRef(0);

  const currentReel = reels[currentIndex];

  // Hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length]);

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setShowHint(false);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    // Swipe up = next video
    if (diff > 50) {
      goToNext();
    }
    // Swipe down = previous video
    else if (diff < -50) {
      goToPrevious();
    }
  };

  // Mouse wheel handler
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const goToNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHint(true);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowHint(true);
    }
  };

  const goToReel = (index) => {
    setCurrentIndex(index);
    setShowHint(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        ref={containerRef}
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: '600px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Instagram Embed */}
        <iframe
          src={currentReel.embedUrl}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title={currentReel.title}
        />

        {/* Swipe Hint Overlay */}
        {showHint && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="text-center text-white">
              <div className="flex flex-col items-center gap-2 animate-bounce">
                <ChevronUp className="w-12 h-12" />
                <div className="text-lg font-semibold">Свайп для прокрутки</div>
                <ChevronDown className="w-12 h-12" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex flex-col gap-2 z-10">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all ${
              currentIndex === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/40 active:scale-95'
            }`}
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex flex-col gap-2 z-10">
          <button
            onClick={goToNext}
            disabled={currentIndex === reels.length - 1}
            className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all ${
              currentIndex === reels.length - 1
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/40 active:scale-95'
            }`}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10 max-h-96 overflow-y-auto">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReel(index)}
              className={`transition-all ${
                index === currentIndex 
                  ? 'w-3 h-8 bg-red-600 rounded-full' 
                  : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Instagram Link */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg"
          >
            <a 
              href={currentReel.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <div className="text-white">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
              {currentReel.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-white/80">
              <span>❤️ {currentReel.likes.toLocaleString()}</span>
              <span>💬 {currentReel.comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Below */}
      <div className="mt-4 text-center">
        <div className="text-gray-600 text-sm">
          {currentIndex + 1} из {reels.length} отзывов
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Используйте ↑↓ клавиши, свайп или колёсико мыши
        </div>
      </div>
    </div>
  );
};

export default InstagramReelsPlayer;
