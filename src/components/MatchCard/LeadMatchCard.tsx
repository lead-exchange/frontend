import { type FC } from 'react';
import type { Lead } from '@/types/entity';
import './TinderCard.css';
import { ComissionDisplay } from '../Comission/ComissionDisplay';
import { Chips } from '../common/Chips';

interface LeadMatchCardProps {
  data: Lead;
  displayComission?: boolean;
}

export const LeadMatchCard: FC<LeadMatchCardProps> = ({ data, displayComission }) => {
  const { name, requirements, commissionShare, description } = data;

  const propertyTypeMap = {
    apartment: 'квартира',
    house: 'дом',
    commercial: 'коммерческое',
  };

  return (
    <div className="match-card__content" style={{ paddingTop: '24px' } /* Too lazy to make it prettier */}>
      <div className="match-card__info">
        <h3 className="match-card__title">{name}</h3>

        <p className="match-card__subtitle">
          Ищет {requirements.bedrooms ? `${requirements.bedrooms}-комн.` : ''} {propertyTypeMap[requirements.propertyType]}
        </p>

        <p className="match-card__details">
          {requirements.minArea}-{requirements.maxArea} кв.м.
        </p>

        <p className="match-card__details">
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          }).format(requirements.minPrice)}{' '}
          –{' '}
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          }).format(requirements.maxPrice)}
        </p>

        {displayComission && <ComissionDisplay type="seller" value={100 - commissionShare} />}
      </div>

      <Chips values={requirements.locations.concat(requirements.repairType || []).concat(requirements.marketType || [])} />

      {description && <p className="match-card__description">{description}</p>}
    </div>
  );
};
