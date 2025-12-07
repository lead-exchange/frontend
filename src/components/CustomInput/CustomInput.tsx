import { FC, InputHTMLAttributes } from 'react';
import styles from './CustomInput.module.css';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasError?: boolean;
  suffix?: string;
  errorMessage?: string;
}

export const CustomInput: FC<CustomInputProps> = ({
  label,
  hasError,
  suffix,
  errorMessage,
  className,
  ...props
}) => {
  return (
    <div className={`${styles.inputContainer} ${hasError ? styles.error : ''} ${className || ''}`}>
      <div className={`${styles.inputWrapper} ${hasError ? styles.error : ''}`}>
        {label && <div className={styles.label}>{label}</div>}
        <input
          className={`${styles.input} ${hasError ? styles.error : ''}`}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}
    </div>
  );
};
