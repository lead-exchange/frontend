import { FC } from 'react';

import styles from './Comission.module.css';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';

interface ComissionBidsProps {
  yours: number;
}

export const ComissionBids: FC<ComissionBidsProps> = ({ yours }) => {
  return (
    <div className={styles.comissionBidsContainer}>
      <SectionHeader large={true} className={styles.comissionBidsYours}>
        Агент покупателя / Агент продавца
      </SectionHeader>

      <div className={`${styles.comissionBids} ${styles.comissionBidsYours}`}>
        <span className={styles.comissionBidsText}>Последнее предложение:</span>
        <span className={styles.comissionBidsValue}>
          {yours}/{100 - yours}
        </span>
      </div>

    </div>
  );
};
