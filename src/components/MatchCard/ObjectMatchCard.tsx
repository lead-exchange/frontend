import { type FC } from 'react';
import type { RealEstateObject } from '@/types/entity';
import './TinderCard.css';

import { ImageWithSteps } from '@/components/common/ImageWithSteps';
import { ComissionDisplay } from '@/components/Comission/ComissionDisplay';
import { Chips } from '../common/Chips';

interface ObjectMatchCardProps {
  data: RealEstateObject;
  displayComission?: boolean;
}

export const ObjectMatchCard: FC<ObjectMatchCardProps> = ({ data, displayComission }) => {
  const { attributes, commissionShare } = data;
  const photos = attributes.photos ?? [];

  const chipValues = attributes.marketType || [];

  if (attributes.paymentType) {
    chipValues.concat(attributes.paymentType);
  }

  if (attributes.propertyClass) {
    chipValues.push(attributes.propertyClass);
  }
  if (attributes.repairType) {
    chipValues.push(attributes.repairType);
  }

  return (
    <div className="match-card__content">
      <ImageWithSteps key={data.id} photos={photos} />

      <div className="match-card__info">
        <h3 className="match-card__title">{attributes.title}</h3>

        <p className="match-card__price">
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          }).format(attributes.price)}
        </p>

        <p className="match-card__address">{attributes.address}</p>

        {displayComission && <ComissionDisplay type="buyer" value={commissionShare} />}
      </div>

      {chipValues.length > 0 && <Chips values={chipValues} />}
    </div>
  );
};
