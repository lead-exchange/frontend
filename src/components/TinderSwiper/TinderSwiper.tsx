import { type FC, useState, useRef, useEffect } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { ThumbsDown, ThumbsUp, DollarSign } from 'lucide-react';
import { TinderCard } from '../TinderCard/TinderCard';
import type { Lead, RealEstateObject } from '@/types/entity';
import './TinderSwiper.css';

interface TinderSwiperProps {
  items: (Lead | RealEstateObject)[];
  onLike?: (item: Lead | RealEstateObject) => void;
  onDislike?: (item: Lead | RealEstateObject) => void;
  onCustomShare?: (item: Lead | RealEstateObject) => void;
  onFinish?: () => void;
}

export const TinderSwiper: FC<TinderSwiperProps> = ({
  items,
  onLike,
  onDislike,
  onCustomShare,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= items.length && onFinish) {
      onFinish();
    }
  }, [currentIndex, items.length, onFinish]);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentItem = items[currentIndex];
    
    if (direction === 'left' && onDislike) {
      onDislike(currentItem);
    } else if (direction === 'right' && onLike) {
      onLike(currentItem);
    } else if (direction === 'up' && onCustomShare) {
      onCustomShare(currentItem);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else if (Math.abs(deltaY) > threshold && deltaY < 0) {
      handleSwipe('up');
    }

    setTouchStart(null);
  };

  if (currentIndex >= items.length) {
    return (
      <div className="tinder-swiper__empty">
        <p>Больше нет карточек для просмотра</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const progressPercent = ((currentIndex + 1) / items.length) * 100;

  return (
    <div className="tinder-swiper">
      <div className="tinder-swiper__progress">
        <div className="tinder-swiper__progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div 
        className="tinder-swiper__card-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={cardRef}
      >
        <TinderCard data={currentItem} />
      </div>

      <div className="tinder-swiper__controls">
        <Button
          mode="bezeled"
          size="m"
          onClick={() => handleSwipe('left')}
          className="tinder-swiper__control-button"
        >
          <ThumbsDown size={20} />
          <span>Дизлайк</span>
        </Button>
        
        <Button
          mode="bezeled"
          size="m"
          onClick={() => handleSwipe('up')}
          className="tinder-swiper__control-button"
        >
          <DollarSign size={20} />
          <span>Своя доля</span>
        </Button>
        
        <Button
          mode="bezeled"
          size="m"
          onClick={() => handleSwipe('right')}
          className="tinder-swiper__control-button"
        >
          <ThumbsUp size={20} />
          <span>Лайк</span>
        </Button>
      </div>
    </div>
  );
};
