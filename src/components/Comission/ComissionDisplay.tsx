import { FC } from 'react';

import './comission.css';

interface ComissionDisplayProps {
  type: 'buyer' | 'seller';
  value: number;
}

export const ComissionDisplay: FC<ComissionDisplayProps> = ({ type, value }) => {
  return (
    <>
      <div className="commission-display">
        <p className="commission-display__yours">
          {type === 'buyer' ? 'Агент покупателя' : 'Агент продавца'}: {value}%
        </p>

        <p className="commission-display__theirs">
          {type === 'buyer' ? 'Агент продавца' : 'Агент покупателя'}: {100 - value}%
        </p>
      </div>
    </>
  );
};
