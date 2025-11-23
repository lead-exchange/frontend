import { InlineButtons } from '@telegram-apps/telegram-ui';
import { ThumbsDown, ThumbsUp, DollarSign } from 'lucide-react';
import { FC } from 'react';

interface MatchControlsProps {
  onDislike: () => void;
  onLike: () => void;
  onComission: () => void;
}

export const MatchControls: FC<MatchControlsProps> = ({ onDislike, onComission, onLike }) => {
  return (
    <InlineButtons mode="bezeled" className="tinder-swiper__controls">
      <InlineButtons.Item text="Дизлайк" className="tinder-swiper__control-button" onClick={onDislike}>
        <ThumbsDown size={20} />
      </InlineButtons.Item>

      <InlineButtons.Item text="Cвоя доля" className="tinder-swiper__control-button" onClick={onComission}>
        <DollarSign size={20} />
      </InlineButtons.Item>

      <InlineButtons.Item text="Лайк" className="tinder-swiper__control-button" onClick={onLike}>
        <ThumbsUp size={20} />
      </InlineButtons.Item>
    </InlineButtons>
  );
};
