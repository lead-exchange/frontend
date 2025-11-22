import {
  type FC,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageSliderProps {
  photos: string[];
  title: string;
}

const SLIDER_SWIPE_THRESHOLD = 40;

export const ImageWithSlider: FC<PropertyImageSliderProps> = ({ photos, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [photos]);

  if (!photos.length) {
    return null;
  }

  const slideTo = (index: number) => {
    setActiveIndex((index + photos.length) % photos.length);
  };

  const handlePrev = () => {
    slideTo(activeIndex - 1);
  };

  const handleNext = () => {
    slideTo(activeIndex + 1);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (photos.length <= 1) {
      return;
    }

    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      return;
    }

    pointerStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.stopPropagation();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null) {
      return;
    }

    event.stopPropagation();
  };

  const releasePointer = (target: EventTarget & HTMLDivElement, pointerId: number) => {
    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null) {
      releasePointer(event.currentTarget, event.pointerId);
      event.stopPropagation();
      return;
    }

    const deltaX = event.clientX - pointerStartRef.current;

    if (Math.abs(deltaX) > SLIDER_SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    pointerStartRef.current = null;
    releasePointer(event.currentTarget, event.pointerId);
    event.stopPropagation();
  };

  const handleDotClick = (event: ReactMouseEvent<HTMLButtonElement>, index: number) => {
    event.stopPropagation();
    slideTo(index);
  };

  const handleNavClick = (event: ReactMouseEvent<HTMLButtonElement>, direction: 'prev' | 'next') => {
    event.stopPropagation();

    if (direction === 'prev') {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <div
      className="tinder-card__slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      role="region"
      aria-label={`Фотографии объекта ${title}`}
    >
      <div className="tinder-card__slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="tinder-card__slider-slide">
            <img src={photo} alt={`${title}. Фото ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="tinder-card__slider-nav tinder-card__slider-nav--prev"
            onClick={event => handleNavClick(event, 'prev')}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="tinder-card__slider-nav tinder-card__slider-nav--next"
            onClick={event => handleNavClick(event, 'next')}
            aria-label="Следующее фото"
          >
            <ChevronRight size={18} />
          </button>

          <div className="tinder-card__slider-dots">
            {photos.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                className={`tinder-card__slider-dot${index === activeIndex ? ' tinder-card__slider-dot--active' : ''}`}
                aria-label={`Показать фото ${index + 1}`}
                onClick={event => handleDotClick(event, index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
