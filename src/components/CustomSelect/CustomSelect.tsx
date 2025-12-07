import { FC, SelectHTMLAttributes } from 'react';
import styles from './CustomSelect.module.css';

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  label,
  hasError,
  errorMessage,
  className,
  children,
  ...props
}) => {
  return (
    <div className={`${styles.selectContainer} ${hasError ? styles.error : ''} ${className || ''}`}>
      <div className={`${styles.selectWrapper} ${hasError ? styles.error : ''}`}>
        {label && <div className={styles.label}>{label}</div>}
        <select
          className={`${styles.select} ${hasError ? styles.error : ''}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}
    </div>
  );
};
