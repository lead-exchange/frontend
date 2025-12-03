import { type FC, useState } from 'react';

import { Steps } from '@telegram-apps/telegram-ui';

import './ImageWithSteps.css';
import { Image } from 'lucide-react';

interface ImageWithStepsProps {
  photos: string[];
  height?: string;
}

export const ImageWithSteps: FC<ImageWithStepsProps> = ({ photos, height }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length > 0) {
    return (
      <div
        className="image-w-steps"
        style={{ height: height }}
        onClick={() => setActiveIndex(idx => (idx + 1) % photos.length)}
      >
        {photos.length > 1 && <Steps className="image-w-steps__steps" count={photos.length} progress={activeIndex + 1} />}
        <img className="image-w-steps__image" src={photos[activeIndex]} alt="some image" />
      </div>
    );
  }

  return (
    <div style={{ height: height }} className="image-w-steps image-placeholder">
      <Image size={96} strokeWidth={1} className="image-placeholder__icon" />
    </div>
  );
};
