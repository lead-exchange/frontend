import { Chip } from '@telegram-apps/telegram-ui';
import { FC } from 'react';

interface ChipsProps {
  values: (string | undefined)[];
}

export const Chips: FC<ChipsProps> = ({ values }) => {
  return (
    <div className="tinder-card__chips">
      {values.map(
        (value, idx) =>
          value && (
            <Chip mode={'mono'} key={idx}>
              {value}
            </Chip>
          )
      )}
    </div>
  );
};
