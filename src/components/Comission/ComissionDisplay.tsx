import { FC } from 'react';

import styles from './Comission.module.css';

interface ComissionDisplayProps {
  type: 'buyer' | 'seller';
  value: number;
}

export const ComissionDisplay: FC<ComissionDisplayProps> = ({ type, value }) => {
  return (
    <div>
      <div className={styles.commissionDisplay}>
        <p className={styles.commissionDisplayYours}>
          {type === 'buyer' ? 'Агент покупателя' : 'Агент продавца'}: {value}%
        </p>

        <p className={styles.commissionDisplayTheirs}>
          {type === 'buyer' ? 'Агент продавца' : 'Агент покупателя'}: {100 - value}%
        </p>
      </div>
    </div>
  );
};
