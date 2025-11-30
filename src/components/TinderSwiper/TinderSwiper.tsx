import { type FC, useState, useRef, useLayoutEffect } from 'react';
import type { Lead, RealEstateObject } from '@/types/entity';
import { ObjectMatchCard } from '../MatchCard/ObjectMatchCard';
import { LeadMatchCard } from '../MatchCard/LeadMatchCard';

import './TinderSwiper.css';
import { MatchControls } from '../MatchControls/MatchControls';
import { ComissionModal } from '../Comission/ComissionModal';

interface TinderSwiperProps {
  items: (Lead | RealEstateObject)[];
  onLike: (item: Lead | RealEstateObject) => void;
  onDislike: (item: Lead | RealEstateObject) => void;
  onCustomShare: (item: Lead | RealEstateObject, comission: number) => void;
  onFinish: () => void;
}

const moveThreshold = 25;

const nextItemInitialScale = 0.6;

const swipeActionThreshold = 100;

export const TinderSwiper: FC<TinderSwiperProps> = ({ items, onLike, onDislike, onCustomShare, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false);

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const [moveOffset, setMoveOffset] = useState(0);

  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (currentIndex === items.length) {
      onFinish();
    }

    if (!currentCardRef.current) {
      return;
    }

    currentCardRef.current.style.transition = '';
    currentCardRef.current.style.transform = 'translateX(0) rotate(0)';
    currentCardRef.current.style.opacity = '1';

    if (nextCardRef.current) {
      nextCardRef.current.style.transition = '';
    }
  }, [currentIndex, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentCardRef.current) {
      currentCardRef.current.style.transition = 'none';
    }

    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!currentCardRef.current || !touchStart) {
      return;
    }

    const deltaX = e.touches[0].clientX - touchStart?.x;

    let currentMoveOffset = moveOffset; // workaround because set state happens only on next rerender

    if (moveOffset === 0) {
      if (Math.abs(deltaX) < moveThreshold) {
        return;
      }
      currentMoveOffset = deltaX > 0 ? -1 * moveThreshold : moveThreshold;
      setMoveOffset(currentMoveOffset);
    }

    const moveX = deltaX + currentMoveOffset;

    currentCardRef.current.style.transform = `translateX(${moveX}px)`;

    if (!nextCardRef.current) {
      return;
    }

    const scale = Math.min(1, nextItemInitialScale + ((1 - nextItemInitialScale) * Math.abs(moveX)) / swipeActionThreshold);

    nextCardRef.current.style.transform = `scale(${scale}, ${scale})`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!currentCardRef.current || !touchStart) return;

    setMoveOffset(0);
    setTouchStart(null);

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaY) > swipeActionThreshold && deltaY < 0) {
      setIsComissionModalOpen(true);
      return;
    }

    if (Math.abs(deltaX) > swipeActionThreshold) {
      currentCardRef.current.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

      currentCardRef.current.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px) rotate(${
        deltaX > 0 ? 45 : -45
      }deg)`;

      currentCardRef.current.style.opacity = '0';

      if (nextCardRef.current) {
        nextCardRef.current.style.transition = 'transform 0.2s ease';
        nextCardRef.current.style.transform = 'scale(1, 1)';
      }

      if (deltaX < 0) {
        onLike(currentItem);
      } else {
        onDislike(currentItem);
      }

      if (currentIndex + 1 === items.length) {
        onFinish();
      }

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 400);
    } else {
      currentCardRef.current.style.transition = 'transform 0.3s ease';
      currentCardRef.current.style.transform = 'translateX(0) rotate(0)';
    }
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
          <div className="tinder-swiper__card-container">
            {nextItem.type === 'object' ? (
              <ObjectMatchCard data={nextItem} displayComission={true} />
            ) : (
              <LeadMatchCard data={nextItem} displayComission={true} />
            )}
          </div>

          <div className="tinder-swiper__match-controls">
            <MatchControls onLike={() => {}} onComission={() => {}} onDislike={() => {}} />
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
        <div className="tinder-swiper__card-container">
          {currentItem.type === 'object' ? (
            <ObjectMatchCard data={currentItem} displayComission={true} />
          ) : (
            <LeadMatchCard data={currentItem} displayComission={true} />
          )}
        </div>

        <div className="tinder-swiper__match-controls">
          <MatchControls
            onLike={() => {
              onLike(currentItem);
              setCurrentIndex(prev => prev + 1);
            }}
            onComission={() => setIsComissionModalOpen(true)}
            onDislike={() => {
              onDislike(currentItem);
              setCurrentIndex(prev => prev + 1);
            }}
          />
        </div>
      </div>
    </>
  );
};
