import {
  type FC,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card } from '@telegram-apps/telegram-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lead, RealEstateObject } from '@/types/entity';
import './TinderCard.css';

interface TinderCardProps {
  data: Lead | RealEstateObject;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

interface PropertyImageSliderProps {
  photos: string[];
  title: string;
}

const SLIDER_SWIPE_THRESHOLD = 40;

const PropertyImageSlider: FC<PropertyImageSliderProps> = ({ photos, title }) => {
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

  const handleNavClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    direction: 'prev' | 'next',
  ) => {
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
      <div
        className="tinder-card__slider-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
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

export const TinderCard: FC<TinderCardProps> = ({ data }) => {
  const isLead = data.type === 'lead';

  if (isLead) {
    const lead = data as Lead;
    const { requirements, commissionShare, description } = lead;
    
    const propertyTypeMap = {
      apartment: 'квартира',
      house: 'дом',
      commercial: 'коммерческое',
    };

    return (
      <Card className="tinder-card">
        <div className="tinder-card__content">
          <div className="tinder-card__info">
            <h3 className="tinder-card__title">{lead.name}</h3>
            <p className="tinder-card__subtitle">
              Ищет {requirements.bedrooms ? `${requirements.bedrooms}-комн.` : ''} {propertyTypeMap[requirements.propertyType]}
            </p>
            <p className="tinder-card__details">
              {requirements.minArea}-{requirements.maxArea} кв.м.
            </p>
            <p className="tinder-card__details">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(requirements.minPrice)} – {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(requirements.maxPrice)}
            </p>
            <div className="tinder-card__commission">
              <p className="tinder-card__commission-seller">Агент продавца: {100 - commissionShare}%</p>
              <p className="tinder-card__commission-buyer">Агент покупателя: {commissionShare}%</p>
            </div>
          </div>

          <div className="tinder-card__chips">
            {requirements.locations.map((location, idx) => (
              <span key={idx} className="tinder-card__chip">{location}</span>
            ))}
            {requirements.repairType?.map((repair, idx) => (
              <span key={`repair-${idx}`} className="tinder-card__chip">{repair}</span>
            ))}
            {requirements.marketType?.map((market, idx) => (
              <span key={`market-${idx}`} className="tinder-card__chip">{market}</span>
            ))}
            {requirements.paymentType?.map((payment, idx) => (
              <span key={`payment-${idx}`} className="tinder-card__chip">{payment}</span>
            ))}
          </div>

          {description && (
            <p className="tinder-card__description">{description}</p>
          )}
        </div>
      </Card>
    );
  } else {
    const object = data as RealEstateObject;
    const { attributes, commissionShare } = object;
    const photos = attributes.photos ?? [];

    return (
      <Card className="tinder-card">
        <div className="tinder-card__content">
          <PropertyImageSlider photos={photos} title={attributes.title} />
          
          <div className="tinder-card__info">
            <h3 className="tinder-card__title">{attributes.title}</h3>
            <p className="tinder-card__price">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(attributes.price)}
            </p>
            <p className="tinder-card__address">{attributes.address}</p>
            <div className="tinder-card__commission">
              <p className="tinder-card__commission-buyer">Агент покупателя: {commissionShare}%</p>
              <p className="tinder-card__commission-seller">Агент продавца: {100 - commissionShare}%</p>
            </div>
          </div>

          <div className="tinder-card__chips">
            {attributes.propertyClass && (
              <span className="tinder-card__chip">{attributes.propertyClass}</span>
            )}
            {attributes.repairType && (
              <span className="tinder-card__chip">{attributes.repairType}</span>
            )}
            {attributes.marketType?.map((market, idx) => (
              <span key={`market-${idx}`} className="tinder-card__chip">{market}</span>
            ))}
            {attributes.paymentType?.map((payment, idx) => (
              <span key={`payment-${idx}`} className="tinder-card__chip">{payment}</span>
            ))}
          </div>
        </div>
      </Card>
    );
  }
};
