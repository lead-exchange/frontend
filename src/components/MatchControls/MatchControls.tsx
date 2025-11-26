import { InlineButtons } from '@telegram-apps/telegram-ui';
import { ThumbsDown, ThumbsUp, DollarSign } from 'lucide-react';
import { FC } from 'react';
import './MatchControls.css';

interface MatchControlsProps {
  onDislike: () => void;
  onLike: () => void;
  onComission: () => void;
}

export const MatchControls: FC<MatchControlsProps> = ({ onDislike, onComission, onLike }) => {
  return (
    <InlineButtons mode="bezeled" className="match-controls">
      <InlineButtons.Item text="Дизлайк" className="match-controls__button" onClick={onDislike}>
        <ThumbsDown size={20} />
      </InlineButtons.Item>

      <InlineButtons.Item text="Cвоя доля" className="match-controls__button" onClick={onComission}>
        <DollarSign size={20} />
      </InlineButtons.Item>

      <InlineButtons.Item text="Лайк" className="match-controls__button" onClick={onLike}>
        <ThumbsUp size={20} />
      </InlineButtons.Item>
    </InlineButtons>
  );
};
