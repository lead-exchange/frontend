import { type FC } from 'react';
import { Card } from '@telegram-apps/telegram-ui';
import type { Lead, RealEstateObject } from '@/types/entity';
import './TinderCard.css';

interface TinderCardProps {
  data: Lead | RealEstateObject;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

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

    return (
      <Card className="tinder-card">
        <div className="tinder-card__content">
          {attributes.photos && attributes.photos.length > 0 && (
            <div className="tinder-card__image">
              <img src={attributes.photos[0]} alt={attributes.title} />
            </div>
          )}
          
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
