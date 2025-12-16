import { formatNumber } from '@/utils/numberFormat';
import * as yup from 'yup';

export const propertyTypeOptions = [
  { value: 'flat', label: 'Квартира' },
  { value: 'room', label: 'Комната' },
  { value: 'commerce', label: 'Коммерция' },
  { value: 'house', label: 'Загородка' },
  { value: 'land', label: 'Участок' },
  { value: 'garage', label: 'Машиноместо/гараж' },
] as const;

export const renovationTypeOptions = [
  { value: 'ANY', label: 'Не важно' },
  { value: 'NO_RENOVATION', label: 'Без ремонта' },
  { value: 'FINISHING', label: 'Чистовая отделка' },
  { value: 'NEEDS_REPAIR', label: 'Требует ремонта' },
  { value: 'COSMETIC_REPAIR', label: 'Косметический ремонт' },
  { value: 'EURO_REPAIR', label: 'Евроремонт' },
]

export const leadSchema = yup.object({
  name: yup.string()
    .required('Введите имя клиента')
    .max(100, 'Не более 100 символов'),

  commissionShare: yup.number()
    .typeError('Введите число')
    .required('Обязательное поле')
    .min(0, 'От 0% до 100%')
    .max(100, 'От 0% до 100%'),

  propertyType: yup.string()
    .oneOf(['flat', 'room', 'commerce', 'house', 'land', 'garage'] as const)
    .required('Выберите тип недвижимости'),

  renovationType: yup.string()
    .oneOf(['ANY', 'NO_RENOVATION', 'FINISHING', 'NEEDS_REPAIR' ,'COSMETIC_REPAIR', 'EURO_REPAIR'])
    .required('Выберите желаемую отделку'),

  minPrice: yup.number()
    .typeError('Введите число')
    .required('Обязательное поле')
    .integer('Должно быть целым числом')
    .min(0, 'Должно быть положительным'),

  maxPrice: yup.number()
    .typeError('Введите число')
    .required('Обязательное поле')
    .integer('Должно быть целым числом')
    .min(0, 'Должно быть положительным')
    .test('min-max', 'Макс. цена меньше мин.', function (value) {
      const { minPrice } = this.parent;
      return !value || !minPrice || value >= minPrice;
    }),

  minArea: yup.number()
    .typeError('Введите число')
    .required('Обязательное поле')
    .min(0, 'Должно быть положительным'),

  maxArea: yup.number()
    .typeError('Введите число')
    .required('Обязательное поле')
    .min(0, 'Должно быть положительным')
    .test('min-max', 'Макс. площадь меньше мин.', function (value) {
      const { minArea } = this.parent;
      return !value || !minArea || value >= minArea;
    }),

  minKitchenArea: yup.number()
    .typeError('Введите число')
    .min(0, 'Должно быть положительным')
    .notRequired(),

  maxKitchenArea: yup.number()
    .typeError('Введите число')
    .test('min-max kitchen', 'Макс. площадь меньше мин.', function (value) {
      const { minKitchenArea } = this.parent;
      console.log(minKitchenArea);
      if (!minKitchenArea) {
        return true;
      }
      return !value || value >= minKitchenArea;
    })
    .notRequired(),

  locations: yup.string()
    .required('Укажите хотя бы одну локацию'),

  bedrooms: yup.number()
    .typeError('Введите число')
    .integer('Должно быть целым числом')
    .min(0, 'Должно быть положительным')
    .notRequired(),

  description: yup.string()
    .max(500, 'Не более 500 символов')
    .notRequired(),
});

export type LeadFormData = yup.InferType<typeof leadSchema>;

export const DEFAULT_VALUES: Partial<LeadFormData> = {
  propertyType: 'flat',
  renovationType: 'ANY',
  name: '',
  locations: '',
};

export const NUMERIC_FIELDS = [
  { name: 'minPrice', label: 'Минимальная цена', suffix: '₽', placeholder: formatNumber(1000000) },
  { name: 'maxPrice', label: 'Максимальная цена', suffix: '₽', placeholder: formatNumber(5000000) },
  { name: 'minArea', label: 'Минимальная площадь', suffix: 'м²', placeholder: formatNumber(30) },
  { name: 'maxArea', label: 'Максимальная площадь', suffix: 'м²', placeholder: formatNumber(100) },
  { name: 'minKitchenArea', label: 'Минимальная площадь кухни', suffix: 'м²', placeholder: formatNumber(5) },
  { name: 'maxKitchenArea', label: 'Максимальная площадь кухни', suffix: 'м²', placeholder: formatNumber(15) },
] as const;
