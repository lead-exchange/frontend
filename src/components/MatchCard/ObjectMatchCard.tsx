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

  const address = attributes.address;

  const adressParts = [
    address.regionName + (address.regionType ? ' ' + address.regionType : ''),
    address.cityName,
    address.streetName && (address.streetType ? address.streetType + ' ' : '') + address.streetName,
    address.house,
    address.flat,
  ].filter(item => item);

  return (
    <div className="match-card__content">
      <ImageWithSteps key={data.id} photos={photos} />

      <div className="match-card__info">
        <h3 className="match-card__title">{data.displayName}</h3>

        <p className="match-card__price">
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          }).format(attributes.price)}
        </p>

        <p className="match-card__address">{adressParts.join(', ')}</p>

        {displayComission && <ComissionDisplay type="buyer" value={commissionShare} />}
      </div>

      <Chips
        values={[attributes.propertyClass, attributes.repairType]
          .concat(attributes.marketType)
          .concat(attributes.paymentType)}
      />
    </div>
  );
};
