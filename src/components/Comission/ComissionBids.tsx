import { FC } from 'react';

import styles from './Comission.module.css';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';

interface ComissionBidsProps {
  yours: number;
  theirs: number;
}

export const ComissionBids: FC<ComissionBidsProps> = ({ yours, theirs }) => {
  return (
    <div className={styles.comissionBidsContainer}>
      <SectionHeader large={true} style={{ paddingBottom: 0 }}>
        Агент покупателя / Агент продавца
      </SectionHeader>

      <div className={`${styles.comissionBids} ${styles.comissionBidsYours}`}>
        <span className={styles.comissionBidsText}>Ваше предложение:</span>
        <span className={styles.comissionBidsValue}>
          {yours}/{100 - yours}
        </span>
      </div>

      <div className={`${styles.comissionBids} ${styles.comissionBidsTheirs}`}>
        <span className={styles.comissionBidsText}>Встречное предложение:</span>
        <span className={styles.comissionBidsValue}>
          {theirs}/{100 - theirs}
        </span>
      </div>
    </div>
  );
};
