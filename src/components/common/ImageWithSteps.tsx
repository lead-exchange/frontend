import { type FC, useState } from 'react';

import { Steps } from '@telegram-apps/telegram-ui';

import styles from './ImageWithSteps.module.css';
import { Image } from 'lucide-react';

interface ImageWithStepsProps {
  photos: string[];
  height?: string;
}

export const ImageWithSteps: FC<ImageWithStepsProps> = ({ photos, height }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    setActiveIndex(idx => (idx + 1) % photos.length);
  };

  const goPrev = () => {
    setActiveIndex(idx => (idx - 1 + photos.length) % photos.length);
  };

  const handleNextClick: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement> = event => {
    event.stopPropagation();
    goNext();
  };

  const handlePrevClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    goPrev();
  };

  if (photos.length > 0) {
    return (
      <div
        className={styles.imageWithSteps}
        style={{ height: height }}
        onClick={goNext}
      >
        {photos.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={handlePrevClick}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={handleNextClick}
            >
              ›
            </button>
          </>
        )}
        {photos.length > 1 && <Steps className={styles.steps} count={photos.length} progress={activeIndex + 1} />}
        <img className={styles.image} src={photos[activeIndex]} alt="some image" />
      </div>
    );
  }

  return (
    <div style={{ height: height }} className={`${styles.imageWithSteps} ${styles.imagePlaceholder}`}>
      <Image size={96} strokeWidth={1} className={styles.imagePlaceholderIcon} />
    </div>
  );
};
