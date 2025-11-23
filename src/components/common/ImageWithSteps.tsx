import { type FC, useState } from 'react';

import { Steps } from '@telegram-apps/telegram-ui';

import './ImageWithSteps.css';

interface ImageWithStepsProps {
  photos: string[];
}

export const ImageWithSteps: FC<ImageWithStepsProps> = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="image-w-steps" onClick={() => setActiveIndex(idx => (idx + 1) % photos.length)}>
      <Steps className="image-w-steps__steps" count={photos.length} progress={activeIndex + 1} />
      <img className="image-w-steps__image" src={photos[activeIndex]} alt="some image" />
    </div>
  );
};
