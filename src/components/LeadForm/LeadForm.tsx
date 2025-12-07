import { FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select, Button, List, Section, Textarea } from '@telegram-apps/telegram-ui';
import { Plus } from 'lucide-react';
import { LeadFormData, leadSchema, NUMERIC_FIELDS, propertyTypeOptions } from './schema';
import { FormFieldWrapper, formFieldStyles } from '../FormField/FormFieldWrapper';
import { formatNumber, parseNumber } from '@/utils/numberFormat';
import styles from './LeadForm.module.css';

interface LeadFormProps {
  initialValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  submitText?: string;
  isLoading?: boolean;
}

export const LeadForm: FC<LeadFormProps> = ({ 
  initialValues, 
  onSubmit, 
  submitText = 'Создать лида',
  isLoading = false 
}) => {
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
    
    const data = getValues();
    await onSubmit(data as LeadFormData);
  };

  return (
    <form className={styles.container} onSubmit={handleFormSubmit}>
      <List className={styles.list}>
        <Section
          header="Основная информация"
          footer="Заполните информацию о клиенте"
          className={styles.formSection}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.name}>
                <Input
                  {...field}
                  header="Имя клиента"
                  placeholder="Введите имя"
                  className={formFieldStyles.inputField}
                  status={errors.name ? 'error' : 'default'}
                />
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="commissionShare"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.commissionShare}>
                <Input
                  {...field}
                  value={field.value !==  null ? formatNumber(field.value) : ''}
                  onChange={(e) => {
                    const num = parseNumber(e.target.value);
                    field.onChange(num);
                  }}
                  header="Агент покупателя"
                  placeholder="70"
                  type="text"
                  inputMode="numeric"
                  className={formFieldStyles.inputField}
                  status={errors.commissionShare ? 'error' : 'default'}
                  after={<span className={formFieldStyles.inputSuffix}>%</span>}
                />
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.propertyType}>
                <Select
                  {...field}
                  header="Тип недвижимости"
                  className={formFieldStyles.selectField}
                  status={errors.propertyType ? 'error' : 'default'}
                >
                  {propertyTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormFieldWrapper>
            )}
          />

          {NUMERIC_FIELDS.map(item => (
            <Controller
              key={item.name}
              name={item.name as keyof LeadFormData}
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors[item.name as keyof LeadFormData]}>
                  <Input
                    {...field}
                    value={field.value !== null ? formatNumber(field.value as number) : ''}
                    onChange={(e) => {
                      const num = parseNumber(e.target.value);
                      field.onChange(num);
                    }}
                    header={item.label}
                    placeholder={item.placeholder}
                    inputMode="numeric"
                    className={formFieldStyles.inputField}
                    status={errors[item.name as keyof LeadFormData] ? 'error' : 'default'}
                    after={<span className={formFieldStyles.inputSuffix}>{item.suffix}</span>}
                  />
                </FormFieldWrapper>
              )}
            />
          ))}

          <Controller
            name="locations"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.locations}>
                <Input
                  {...field}
                  header="Локации"
                  placeholder="Москва, Центр, Арбат"
                  className={formFieldStyles.inputField}
                  status={errors.locations ? 'error' : 'default'}
                />
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="bedrooms"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.bedrooms}>
                <Input
                  {...field}
                  value={field.value !== null ? formatNumber(field.value) : ''}
                  onChange={(e) => {
                     const num = parseNumber(e.target.value);
                     field.onChange(num);
                  }}
                  header="Количество спален"
                  placeholder="2"
                  type="text"
                  inputMode="numeric"
                  className={formFieldStyles.inputField}
                  status={errors.bedrooms ? 'error' : 'default'}
                />
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.description}>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  header="Описание запроса"
                  placeholder="Введите описание"
                  className={formFieldStyles.inputField}
                  status={errors.description ? 'error' : 'default'}
                />
              </FormFieldWrapper>
            )}
          />
        </Section>

        <div className={styles.buttonContainer}>
          <Button
            size="l"
            stretched
            onClick={handleFormSubmit}
            loading={isLoading || isSubmitting}
            before={<Plus size={20} />}
          >
            {submitText}
          </Button>
        </div>
      </List>
    </form>
  );
};
