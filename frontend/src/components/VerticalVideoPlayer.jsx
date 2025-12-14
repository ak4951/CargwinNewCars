import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const VerticalVideoPlayer = ({ videos, autoPlayOnView = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState({});
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const currentVideo = videos[currentIndex];

  // Auto-play when video comes into view
  useEffect(() => {
    if (!autoPlayOnView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current && !isPlaying) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [currentIndex, autoPlayOnView]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      // Auto-advance to next video
      if (currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, videos.length]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goToVideo = (index) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const toggleLike = () => {
    setLikes(prev => ({
      ...prev,
      [currentVideo.id]: !prev[currentVideo.id]
    }));
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card 
        ref={containerRef}
        className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={currentVideo.videoUrl}
          poster={currentVideo.thumbnail}
          muted={isMuted}
          playsInline
          loop={videos.length === 1}
        />

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <Play className="w-10 h-10 text-red-600 ml-2" />
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            size="sm"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
            onClick={handleFullscreen}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
          <button 
            onClick={toggleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/60 transition-colors">
              <Heart 
                className={`w-6 h-6 transition-all ${
                  likes[currentVideo.id] 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-white'
                }`}
              />
            </div>
            <span className="text-white text-xs font-semibold">
              {currentVideo.likes + (likes[currentVideo.id] ? 1 : 0)}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/60 transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-semibold">
              {currentVideo.comments}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/60 transition-colors">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-semibold">
              Поделиться
            </span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          {/* Author */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-bold text-white">
              {currentVideo.author[0]}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">
                {currentVideo.author}
              </div>
              <div className="text-white/70 text-xs">
                {currentVideo.location}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">
            {currentVideo.title}
          </h3>

          {/* Savings Badge */}
          {currentVideo.savings && (
            <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              💰 Сэкономил ${currentVideo.savings.toLocaleString()}
            </div>
          )}
        </div>

        {/* Video Navigation Dots */}
        {videos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToVideo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Video Title Below */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          {currentIndex + 1} из {videos.length} отзывов
        </p>
      </div>
    </div>
  );
};

export default VerticalVideoPlayer;
