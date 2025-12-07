export const formatNumber = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '';
  const str = String(value);
  const number = str.replace(/\D/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const parseNumber = (value: string): number | null => {
  const clean = value.replace(/\s/g, '');
  return clean === '' ? null : Number(clean);
};
