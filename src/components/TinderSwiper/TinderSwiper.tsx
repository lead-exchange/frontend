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

  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentCardRef.current) {
      return;
    }

    currentCardRef.current.style.transform = 'translateX(0) rotate(0)';
    currentCardRef.current.style.opacity = '1';
    currentCardRef.current.style.transition = '';
  }, [currentIndex]);

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
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentCardRef.current) {
      currentCardRef.current.style.transition = 'none';
    }

    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const threshold = window.document.body.scrollWidth / 3;

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!currentCardRef.current || !touchStart) {
      return;
    }

    const deltaX = e.touches[0].clientX - touchStart?.x;

    currentCardRef.current.style.transform = `translateX(${deltaX}px)`;

    if (!nextCardRef.current) {
      return;
    }

    const scale = 0.7 + Math.min((0.3 * Math.abs(deltaX)) / threshold, 0.3);

    nextCardRef.current.style.transform = `scale(${scale}, ${scale})`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!currentCardRef.current || !touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > threshold) {
      currentCardRef.current.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

      currentCardRef.current.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px) rotate(${
        deltaX > 0 ? 45 : -45
      }deg)`;

      currentCardRef.current.style.opacity = '0';

      if (deltaX < 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }

      if (onFinish && currentIndex + 1 == items.length) {
        onFinish();
      }

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 400);
    } else {
      currentCardRef.current.style.transition = 'transform 0.3s ease';
      currentCardRef.current.style.transform = 'translateX(0) rotate(0)';
    }

    if (Math.abs(deltaY) > threshold && deltaY < 0) {
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
  const nextItem = items[currentIndex + 1] || null;

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

      {nextItem && (
        <div className="tinder-swiper" ref={nextCardRef} style={{ position: 'absolute', width: '100%' }}>
          <div className="tinder-swiper__match-controls">
            <MatchControls onLike={() => {}} onComission={() => {}} onDislike={() => {}} />
          </div>

          <div className="tinder-swiper__card-container">
            {nextItem.type === 'object' ? (
              <ObjectMatchCard data={nextItem} displayComission={true} />
            ) : (
              <LeadMatchCard data={nextItem} displayComission={true} />
            )}
          </div>
        </div>
      )}

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="tinder-swiper"
        ref={currentCardRef}
      >
        <div className="tinder-swiper__match-controls">
          <MatchControls
            onLike={() => handleSwipe('right')}
            onComission={() => handleSwipe('up')}
            onDislike={() => handleSwipe('left')}
          />
        </div>

        <div className="tinder-swiper__card-container">
          {currentItem.type === 'object' ? (
            <ObjectMatchCard data={currentItem} displayComission={true} />
          ) : (
            <LeadMatchCard data={currentItem} displayComission={true} />
          )}
        </div>
      </div>
    </>
  );
};
