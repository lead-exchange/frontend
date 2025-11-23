import { FC } from 'react';

import './comission.css';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';

interface ComissionBidsProps {
  yours: number;
  theirs: number;
}

export const ComissionBids: FC<ComissionBidsProps> = ({ yours, theirs }) => {
  return (
    <div className="comission-bids-container">
      <SectionHeader large={true} style={{ paddingBottom: 0 }}>
        Агент покупателя / Агент продавца
      </SectionHeader>

      <div className="comission-bids comission-bids__yours">
        <span className="comission-bids__text">Ваше предложение:</span>
        <span className="comission-bids__value">
          {yours}/{100 - yours}
        </span>
      </div>

      <div className="comission-bids comission-bids__theirs">
        <span className="comission-bids__text">Встречное предложение:</span>
        <span className="comission-bids__value">
          {theirs}/{100 - theirs}
        </span>
      </div>
    </div>
  );
};
