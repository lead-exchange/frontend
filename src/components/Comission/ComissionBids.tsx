import { FC } from 'react';

import styles from './Comission.module.css';

interface ComissionBidsProps {
  yours: number;
}

export const ComissionBids: FC<ComissionBidsProps> = ({ yours }) => {
  return (
    <div className={styles.comissionBidsContainer}>
        <h3 className={styles.title}>Агент покупателя / Агент продавца</h3>

      <div className={`${styles.comissionBids} ${styles.comissionBidsYours}`}>
        <span className={styles.comissionBidsText}>Последнее предложение:</span>
        <span className={styles.comissionBidsValue}>
          {yours}/{100 - yours}
        </span>
      </div>

    </div>
  );
};
