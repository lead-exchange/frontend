import type { RealEstateObject } from '@/types/entity';
import { CURRENCY_FORMATTER } from '@/constants/formatting';

// Хелперы для форматирования
export const formatPrice = (price: number, pricePerMeter?: number) => {
  const formattedPrice = CURRENCY_FORMATTER.format(price);
  
  if (!pricePerMeter) {
    return formattedPrice;
  }
  
  const formattedPricePerMeter = CURRENCY_FORMATTER.format(pricePerMeter);
  return `${formattedPrice} (${formattedPricePerMeter} / кв. м.)`;
};

export const formatFloor = (floor?: number, floors?: number): string | null => {
  if (!floor) return null;
  return floors ? `${floor}/${floors} эт.` : `${floor} эт.`;
};

export const formatArea = (area: number, suffix: string): string => {
  return `${area} ${suffix}`;
};

export const getAddressParts = (address: RealEstateObject['attributes']['address']): string[] => {
  const parts = [
    address.regionName && address.regionType 
      ? `${address.regionName} ${address.regionType}` 
      : address.regionName,
    typeof address.cityName === 'string' ? address.cityName : null,
    typeof address.streetName === 'string' && typeof address.streetType === 'string'
      ? `${address.streetType} ${address.streetName}`
      : typeof address.streetName === 'string' ? address.streetName : null,
    address.house,
    address.flat,
  ].filter((item): item is string => Boolean(item));
  
  return parts;
};

export const getEstateName = (attributes: RealEstateObject['attributes']): string => {
  // Если есть title в атрибутах, используем его
  if (attributes.title) {
    return attributes.title;
  }
  
  // Иначе собираем из адреса
  const address = attributes.address;
  const addressParts = [
    typeof address.cityName === 'string' ? address.cityName : null,
    typeof address.streetName === 'string' && typeof address.streetType === 'string'
      ? `${address.streetType} ${address.streetName}`
      : typeof address.streetName === 'string' ? address.streetName : null,
    address.house,
    address.flat,
  ].filter((item): item is string => Boolean(item));
  
  if (addressParts.length > 0) {
    return addressParts.join(', ');
  }
  
  // Если и адреса нет, возвращаем заглушку
  return 'Объект недвижимости';
};

export const getEstateChipValues = (attributes: RealEstateObject['attributes']): string[] => {
  const chipValues: string[] = [];
  
  // Основные характеристики
  if (attributes.realtyType) chipValues.push(attributes.realtyType);
  if (attributes.rooms) chipValues.push(`${attributes.rooms} комн.`);
  if (attributes.areaCommon) chipValues.push(formatArea(attributes.areaCommon, 'кв. м.'));
  
  // Этажность
  const floorInfo = formatFloor(attributes.floor, attributes.floors);
  if (floorInfo) chipValues.push(floorInfo);
  
  // Дополнительные характеристики
  if (attributes.builtYear) chipValues.push(attributes.builtYear);
  if (attributes.areaKitchen) chipValues.push(`Кухня ${formatArea(attributes.areaKitchen, 'кв. м.')}`);
  if (attributes.areaLiving) chipValues.push(`Жилая ${formatArea(attributes.areaLiving, 'кв. м.')}`);
  if (attributes.areaLand) chipValues.push(`Участок ${attributes.areaLand} сот.`);
  
  return chipValues;
};
