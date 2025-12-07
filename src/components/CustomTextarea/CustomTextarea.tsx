import { FC, TextareaHTMLAttributes } from 'react';
import styles from './CustomTextarea.module.css';

interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export const CustomTextarea: FC<CustomTextareaProps> = ({
  label,
  hasError,
  errorMessage,
  className,
  ...props
}) => {
  return (
    <div className={`${styles.textareaContainer} ${hasError ? styles.error : ''} ${className || ''}`}>
      <div className={`${styles.textareaWrapper} ${hasError ? styles.error : ''}`}>
        {label && <div className={styles.label}>{label}</div>}
        <textarea
          className={`${styles.textarea} ${hasError ? styles.error : ''}`}
          {...props}
        />
      </div>
      {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}
    </div>
  );
};
