import { type FC, useState, useRef, useEffect } from 'react';
import type { Lead, RealEstateObject } from '@/types/entity';
import { ObjectMatchCard } from '../MatchCard/ObjectMatchCard';
import { LeadMatchCard } from '../MatchCard/LeadMatchCard';

import './TinderSwiper.css';
import { MatchControls } from '../MatchControls/MatchControls';
import { ComissionModal } from '../Comission/ComissionModal';

interface TinderSwiperProps {
  items: (Lead | RealEstateObject)[];
  onLike?: (item: Lead | RealEstateObject) => void;
  onDislike?: (item: Lead | RealEstateObject) => void;
  onCustomShare?: (item: Lead | RealEstateObject, comission: number) => void;
  onFinish?: () => void;
}

export const TinderSwiper: FC<TinderSwiperProps> = ({ items, onLike, onDislike, onCustomShare, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false);

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
    } else if (direction === 'up') {
      setIsComissionModalOpen(true);
      return;
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

  return (
    <>
      <ComissionModal
        onOpenChange={open => setIsComissionModalOpen(open)}
        open={isComissionModalOpen}
        onComissionSubmit={async comission => {
          if (onCustomShare) {
            onCustomShare(currentItem, comission);
            setCurrentIndex(prev => prev + 1);
          }
        }}
      />
      <div className="tinder-swiper">
        <div
          className="tinder-swiper__card-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          ref={cardRef}
        >
          {currentItem.type === 'object' ? (
            <ObjectMatchCard data={currentItem} displayComission={true} />
          ) : (
            <LeadMatchCard data={currentItem} displayComission={true} />
          )}
        </div>

        <MatchControls
          onLike={() => handleSwipe('right')}
          onComission={() => handleSwipe('up')}
          onDislike={() => handleSwipe('left')}
        />
      </div>
    </>
  );
};
