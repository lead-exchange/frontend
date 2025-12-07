import { FC, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import styles from './FormField.module.css';

interface FormFieldWrapperProps {
  children: ReactNode;
  error?: FieldError;
  className?: string;
}

export const FormFieldWrapper: FC<FormFieldWrapperProps> = ({ children, error, className }) => {
  return (
    <div className={`${styles.inputWrapper} ${className || ''}`}>
      {children}
      {error && <div className={styles.errorText}>{error.message}</div>}
    </div>
  );
};

export { styles as formFieldStyles };
