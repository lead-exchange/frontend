import { type FC } from 'react';
import type { RealEstateObject } from '@/types/entity';
import styles from './TinderCard.module.css';

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
  if (attributes.rooms) {
    chipValues.push(`${attributes.rooms}-комн.`);
  }
  if (attributes.areaCommon) {
    chipValues.push(`${attributes.areaCommon} кв. м.`);
  }

  const address = attributes.address;

  const adressParts = [
    address.regionName + (address.regionType ? ' ' + address.regionType : ''),
    address.cityName,
    address.streetName && (address.streetType ? address.streetType + ' ' : '') + address.streetName,
    address.house,
    address.flat,
  ].filter(item => item);

  return (
    <div className={styles.matchCardContent}>
      <ImageWithSteps key={data.id} photos={photos} />

      <div className={styles.matchCardInfo}>
        <h3 className={styles.matchCardTitle}>{data.displayName}</h3>

        <p className={styles.matchCardPrice}>
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          }).format(attributes.price)}
        </p>

        <p className={styles.matchCardAddress}>{adressParts.join(', ')}</p>

        {displayComission && <ComissionDisplay type="buyer" value={commissionShare} />}

        {attributes.description && (
          <div className={styles.matchCardDescriptionSmall}>{attributes.description}</div>
        )}
      </div>

      {chipValues.length > 0 && <Chips values={chipValues} />}
    </div>
  );
};
