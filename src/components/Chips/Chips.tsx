import { Chip } from '@telegram-apps/telegram-ui';
import { FC } from 'react';
import styles from './Chips.module.css';

interface ChipsProps {
  values: (string | undefined)[];
}

export const Chips: FC<ChipsProps> = ({ values }) => {
  return (
    <div className={styles.chipsContainer}>
      {values.map(
        (value, idx) =>
          value && (
            <Chip mode={'mono'} key={`${value}-${idx}`}>
              {value}
            </Chip>
          )
      )}
    </div>
  );
};
