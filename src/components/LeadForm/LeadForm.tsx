import { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@telegram-apps/telegram-ui';
import { Plus } from 'lucide-react';
import { LeadFormData, leadSchema, NUMERIC_FIELDS, propertyTypeOptions, renovationTypeOptions } from './schema';
import { formatNumber, parseNumber } from '@/utils/numberFormat';
import { CustomInput } from '../CustomInput/CustomInput';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { CustomTextarea } from '../CustomTextarea/CustomTextarea';
import styles from './LeadForm.module.css';
import { boolean } from 'yup';

interface LeadFormProps {
  initialValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  submitText?: string;
  isLoading?: boolean;
}

export const LeadForm: FC<LeadFormProps> = ({ initialValues, onSubmit, submitText = 'Создать лида', isLoading = false }) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const {
    control,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(leadSchema) as any,
    defaultValues: initialValues,
    mode: 'all',
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    setIsPressed(true);

    const data = getValues();
    try {
      await onSubmit(data as LeadFormData);
    } catch (e) {
      console.log(e);
      setIsPressed(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <h2 className={styles.title}>Основная информация</h2>

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Имя клиента"
            placeholder="Введите имя"
            hasError={!!errors.name}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        name="commissionShare"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            value={field.value != null ? formatNumber(field.value) : ''}
            onChange={e => {
              const num = parseNumber(e.target.value);
              field.onChange(num);
            }}
            label="Процент комиссии агенту покупателя"
            placeholder="30"
            type="text"
            inputMode="numeric"
            hasError={!!errors.commissionShare}
            errorMessage={errors.commissionShare?.message}
            suffix="%"
          />
        )}
      />

      <Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            label="Тип недвижимости"
            hasError={!!errors.propertyType}
            errorMessage={errors.propertyType?.message}
          >
            {propertyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
        )}
      />

      <Controller
        name="renovationType"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            label="Наличие ремонта"
            hasError={!!errors.renovationType}
            errorMessage={errors.renovationType?.message}
          >
            {renovationTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
        )}
      />

      {NUMERIC_FIELDS.map(item => (
        <Controller
          key={item.name}
          name={item.name as keyof LeadFormData}
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              value={field.value !== null ? formatNumber(field.value as number) : ''}
              onChange={e => {
                const num = parseNumber(e.target.value);
                field.onChange(num);
              }}
              label={item.label}
              placeholder={item.placeholder}
              inputMode="numeric"
              hasError={!!errors[item.name as keyof LeadFormData]}
              errorMessage={errors[item.name as keyof LeadFormData]?.message}
              suffix={item.suffix}
            />
          )}
        />
      ))}

      <Controller
        name="locations"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Локации"
            placeholder="Москва, Центр, Арбат"
            hasError={!!errors.locations}
            errorMessage={errors.locations?.message}
          />
        )}
      />

      <Controller
        name="bedrooms"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            value={field.value !== null ? formatNumber(field.value) : ''}
            onChange={e => {
              const num = parseNumber(e.target.value);
              field.onChange(num);
            }}
            label="Количество комнат"
            placeholder="2"
            type="text"
            inputMode="numeric"
            hasError={!!errors.bedrooms}
            errorMessage={errors.bedrooms?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <CustomTextarea
            {...field}
            value={field.value || ''}
            label="Описание запроса"
            placeholder="Введите описание"
            hasError={!!errors.description}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <div className={styles.buttonContainer}>
        <span className={styles.text}>Заполните информацию о клиенте</span>
        <Button
          disabled={isPressed}
          size="l"
          stretched
          onClick={handleFormSubmit}
          loading={isLoading || isSubmitting}
          before={<Plus size={20} />}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};
