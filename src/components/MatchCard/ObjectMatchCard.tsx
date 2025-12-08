import { type FC } from 'react';
import type { RealEstateObject } from '@/types/entity';
import styles from './TinderCard.module.css';

import { ImageWithSteps } from '@/components/common/ImageWithSteps';
import { ComissionDisplay } from '@/components/Comission/ComissionDisplay';
import { Chips } from '@/components/Chips';
import { formatPrice, getAddressParts, getEstateChipValues } from '@/utils/estateHelpers';

interface ObjectMatchCardProps {
  data: RealEstateObject;
  displayComission?: boolean;
}

export const ObjectMatchCard: FC<ObjectMatchCardProps> = ({ data, displayComission }) => {
  const { attributes, commissionShare } = data;
  
  const photos = attributes.photos ?? [];
  const addressParts = getAddressParts(attributes.address);
  const chipValues = getEstateChipValues(attributes);
  const formattedPrice = formatPrice(attributes.price, attributes.pricePerMeter);
  
  return (
    <div className={styles.matchCardContent}>
      <div className={styles.matchCardImageContainer}>
        <ImageWithSteps key={data.id} photos={photos} />
      </div>
      
      <div className={styles.matchCardInfo}>
        <p className={styles.matchCardPrice}>
          {formattedPrice}
        </p>
        
        <h3 className={styles.matchCardTitle}>{attributes.title}</h3>
        
        {addressParts.length > 0 && (
          <p className={styles.matchCardAddress}>
            {addressParts.join(', ')}
          </p>
        )}
        
        {displayComission && (
          <ComissionDisplay type="buyer" value={commissionShare} />
        )}
        
        {attributes.description && (
          <div className={styles.matchCardDescriptionSmall}>
            {attributes.description}
          </div>
        )}
      </div>
      
      {chipValues.length > 0 && <Chips values={chipValues} />}
    </div>
  );
};
