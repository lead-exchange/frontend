import { type FC, useState, useRef, useLayoutEffect } from 'react';
import type { Lead, RealEstateObject } from '@/types/entity';
import { ObjectMatchCard } from '../MatchCard/ObjectMatchCard';
import { LeadMatchCard } from '../MatchCard/LeadMatchCard';

import './TinderSwiper.css';
import { MatchControls } from '../MatchControls/MatchControls';
import { ComissionModal } from '../Comission/ComissionModal';
import { getLeadsForObject, getObjectsForLead } from '@/requests/tinder';
import { Spinner } from '@telegram-apps/telegram-ui';

interface TinderSwiperProps {
  sourceEntity: Lead | RealEstateObject;
  items: (Lead | RealEstateObject)[];
  onLike: (item: Lead | RealEstateObject) => void;
  onDislike: (item: Lead | RealEstateObject) => void;
  onCustomShare: (item: Lead | RealEstateObject, comission: number) => void;
  onFinish: () => void;
}

const moveThreshold = 25;

const nextItemInitialScale = 0.6;

const swipeActionThreshold = 100;

const defaultTransition = 'outline-color 0.4s ease';

export const TinderSwiper: FC<TinderSwiperProps> = ({
  sourceEntity,
  items: initialItems,
  onLike,
  onDislike,
  onCustomShare,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState<boolean>();

  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false);

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const [moveOffset, setMoveOffset] = useState(0);

  const [items, setItems] = useState<(Lead | RealEstateObject)[]>(initialItems);

  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  const fetchNextPage = async () => {
    setLoading(true);
    try {
      if (sourceEntity.type === 'object') {
        return await getLeadsForObject(sourceEntity.id);
      } else {
        return await getObjectsForLead(sourceEntity.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadNextPageOrFinish = async () => {
    try {
      const newPage = await fetchNextPage();

      if (newPage.length === 0) {
        onFinish();
      }

      setItems(newPage);
      setCurrentIndex(0);
    } catch (e) {
      onFinish();
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    const action = async () => {
      if (currentIndex === items.length) {
        loadNextPageOrFinish();
      }

      if (!currentCardRef.current) {
        return;
      }

      currentCardRef.current.style.outlineColor = 'transparent';
      currentCardRef.current.style.transition = '';
      currentCardRef.current.style.transform = 'translateX(0) rotate(0)';
      currentCardRef.current.style.opacity = '1';

      if (nextCardRef.current) {
        nextCardRef.current.style.transition = '';
      }
    };

    action();
  }, [currentIndex, items.length]);

  if (loading) {
    return (
      <div className="loadingContainer">
        <Spinner size="l" />
      </div>
    );
  }

  const handleTouchStart = (touchStart: { x: number; y: number }) => {
    if (currentCardRef.current) {
      currentCardRef.current.style.transition = defaultTransition;
    }

    setTouchStart(touchStart);
  };

  const handleTouchMove = (clientX: number) => {
    if (!currentCardRef.current || !touchStart) {
      return;
    }

    const deltaX = clientX - touchStart?.x;

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

    if (Math.abs(deltaX) > swipeActionThreshold) {
      if (deltaX > 0) {
        currentCardRef.current.style.outlineColor = 'green';
      } else {
        currentCardRef.current.style.outlineColor = 'red';
      }
    } else {
      currentCardRef.current.style.outlineColor = 'transparent';
    }

    if (!nextCardRef.current) {
      return;
    }

    const scale = Math.min(
      0.9,
      0.9 * nextItemInitialScale + ((1 - nextItemInitialScale) * Math.abs(moveX)) / swipeActionThreshold
    );

    nextCardRef.current.style.transform = `scale(${scale}, ${scale})`;
  };

  const handleTouchEnd = (touchEnd: { x: number; y: number }) => {
    if (!currentCardRef.current || !touchStart) return;

    setMoveOffset(0);
    setTouchStart(null);

    const deltaX = touchEnd.x - touchStart.x;

    if (Math.abs(deltaX) > swipeActionThreshold) {
      currentCardRef.current.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

      currentCardRef.current.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px) rotate(${
        deltaX > 0 ? 45 : -45
      }deg)`;

      currentCardRef.current.style.opacity = '0';

      if (nextCardRef.current) {
        nextCardRef.current.style.transition = 'transform 0.3s ease';
        nextCardRef.current.style.transform = 'scale(1, 1)';
      }

      if (deltaX > 0) {
        onLike(currentItem);
      } else {
        onDislike(currentItem);
      }

      if (currentIndex + 1 === items.length) {
        loadNextPageOrFinish();
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
        onTouchStart={(e: React.TouchEvent) => {
          handleTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }}
        onTouchMove={(e: React.TouchEvent) => {
          handleTouchMove(e.touches[0].clientX);
        }}
        onTouchEnd={(e: React.TouchEvent) => {
          handleTouchEnd({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
        }}
        onMouseDown={(e: React.MouseEvent) => {
          handleTouchStart({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e: React.MouseEvent) => {
          handleTouchMove(e.clientX);
        }}
        onMouseUp={(e: React.MouseEvent) => {
          handleTouchEnd({ x: e.clientX, y: e.clientY });
        }}
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
