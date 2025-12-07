import { type FC } from 'react';
import type { Lead } from '@/types/entity';
import styles from './TinderCard.module.css';
import { ComissionDisplay } from '../Comission/ComissionDisplay';
import { Chips } from '../common/Chips';

interface LeadMatchCardProps {
  data: Lead;
  displayComission?: boolean;
}

export const LeadMatchCard: FC<LeadMatchCardProps> = ({ data, displayComission }) => {
  const { name, requirements, commissionShare, description } = data;

  const propertyTypeMap = {
    flat: 'квартира',
    house: 'дом',
    commerce: 'коммерческое',
    room: 'комнату',
    land: 'участок',
    garage: 'гараж',
  };

  return (
    <div className={`${styles.matchCardContent} ${styles.matchCardContentWithTopPadding}`}>
      <div className={styles.matchCardInfo}>
        <h3 className={styles.matchCardTitle}>{name}</h3>

        <p className={styles.matchCardSubtitle}>
          Ищет {requirements.bedrooms ? `${requirements.bedrooms}-комн.` : ''} {propertyTypeMap[requirements.propertyType]}
        </p>

        <p className={styles.matchCardDetails}>
          {requirements.minArea}-{requirements.maxArea} кв.м.
        </p>

        <p className={styles.matchCardDetails}>
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

      {description && <p className={styles.matchCardDescription}>{description}</p>}
    </div>
  );
};
