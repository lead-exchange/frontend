import type { Lead, RealEstateObject } from '@/types/entity';

const arbatPhotos = [
  new URL('../../assets/estate/arbat/arbat-1.jpg', import.meta.url).href,
  new URL('../../assets/estate/arbat/arbat-2.jpg', import.meta.url).href,
  new URL('../../assets/estate/arbat/arbat-3.jpg', import.meta.url).href,
  new URL('../../assets/estate/arbat/arbat-4.jpg', import.meta.url).href,
];

const elizarovskayaPhotos = [
  new URL('../../assets/estate/elizarovskaya/elizarovskaya-1.jpg', import.meta.url).href,
  new URL('../../assets/estate/elizarovskaya/elizarovskaya-2.jpg', import.meta.url).href,
  new URL('../../assets/estate/elizarovskaya/elizarovskya-3.jpg', import.meta.url).href,
  new URL('../../assets/estate/elizarovskaya/elizarovskya-4.jpg', import.meta.url).href,
];

const leninskyPhotos = [
  new URL('../../assets/estate/leninsky/leninsky-1.jpg', import.meta.url).href,
  new URL('../../assets/estate/leninsky/leninsky-2.jpg', import.meta.url).href,
  new URL('../../assets/estate/leninsky/leninsky-3.jpg', import.meta.url).href,
  new URL('../../assets/estate/leninsky/leninsky-4.jpg', import.meta.url).href,
];

const rublevkaPhotos = leninskyPhotos;

const mockLeads: Lead[] = [
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Иван Петров и Марина Петрова',
    type: 'lead',
    userId: '11111111-1111-1111-1111-111111111111',
    requirements: {
      propertyType: 'house',
      minPrice: 20000000,
      maxPrice: 25000000,
      minArea: 80,
      maxArea: 120,
      locations: ['Сестрорецк'],
      bedrooms: 3,
      repairType: ['Ремонт любой'],
      marketType: ['Вторичка'],
      paymentType: ['Обмен', 'Наличка'],
    },
    status: 'ACTIVE',
    commissionShare: 30,
    description: 'Семейная пара с собакой. Хотят дом с небольшим участком поближе к воде.',
    createdAt: '2024-01-20T11:00:00.000000',
    updatedAt: '2024-01-20T11:00:00.000000',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Анна Сидорова',
    type: 'lead',
    userId: '22222222-2222-2222-2222-222222222222',
    requirements: {
      propertyType: 'house',
      minPrice: 30000000,
      maxPrice: 35000000,
      minArea: 120,
      maxArea: 200,
      locations: ['Московская область'],
      bedrooms: 4,
    },
    status: 'ACTIVE',
    commissionShare: 35,
    description: 'Семья из 4 человек ищет просторный дом за городом.',
    createdAt: '2024-01-21T14:30:00.000000',
    updatedAt: '2024-01-22T10:15:00.000000',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'ООО "Строй Инвест"',
    type: 'lead',
    userId: '33333333-3333-3333-3333-333333333333',
    requirements: {
      propertyType: 'commercial',
      minPrice: 15000000,
      maxPrice: 20000000,
      minArea: 80,
      maxArea: 150,
      locations: ['Москва, деловой район'],
      bedrooms: null,
    },
    status: 'ACTIVE',
    commissionShare: 40,
    description: 'Под офис или магазин.',
    createdAt: '2024-01-19T09:45:00.000000',
    updatedAt: '2024-01-25T16:20:00.000000',
  },
];

const mockObjects: RealEstateObject[] = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: '3-комн. квартира, 7/10 этаж, 104 кв. м.',
    type: 'object',
    userId: '22222222-2222-2222-2222-222222222222',
    attributes: {
      title: '3-комн. квартира, 7/10 этаж, 104 кв. м.',
      description: 'Просторная 3-комнатная квартира с евроремонтом в центре города',
      address: 'м. Елизаровская',
      price: 25100000,
      area: 104,
      bedrooms: 3,
      floor: 7,
      totalFloors: 10,
      repairType: 'Дизайнерский ремонт',
      propertyClass: 'Комфорт',
      marketType: ['Вторичка'],
      paymentType: ['Обмен', 'Ипотека'],
      photos: elizarovskayaPhotos,
    },
    totalCommissionRate: 5.0,
    commissionShare: 30,
    status: 'ACTIVE',
    createdAt: '2024-01-19T15:30:00.000000',
    updatedAt: '2024-01-24T12:45:00.000000',
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Премиум дом в Рублевке',
    type: 'object',
    userId: '44444444-4444-4444-4444-444444444444',
    attributes: {
      title: 'Премиум дом в Рублевке',
      description: 'Роскошный 5-комнатный дом с бассейном и садом в престижном районе',
      address: 'Московская область, Рублевка',
      price: 42000000,
      area: 145,
      bedrooms: 5,
      propertyClass: 'Премиум',
      photos: rublevkaPhotos,
    },
    totalCommissionRate: 6.0,
    commissionShare: 35,
    status: 'ARCHIVE',
    createdAt: '2024-01-16T11:20:00.000000',
    updatedAt: '2024-01-26T14:30:00.000000',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Коммерческое помещение на Арбате',
    type: 'object',
    userId: '33333333-3333-3333-3333-333333333333',
    attributes: {
      title: 'Коммерческое помещение на Арбате',
      description: 'Торговое помещение с отдельным входом, готово к бизнесу',
      address: 'Москва, ул. Арбат, 25',
      price: 35000000,
      area: 120,
      bedrooms: null,
      photos: arbatPhotos,
    },
    totalCommissionRate: 7.0,
    commissionShare: 40,
    status: 'ACTIVE',
    createdAt: '2024-01-22T16:10:00.000000',
    updatedAt: '2024-01-22T16:10:00.000000',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Уютная квартира на Ленинском проспекте',
    type: 'object',
    userId: '11111111-1111-1111-1111-111111111111',
    attributes: {
      title: 'Уютная квартира на Ленинском проспекте',
      description: 'Уютная 2-комнатная квартира в хорошем состоянии с балконом',
      address: 'Москва, Ленинский проспект, 75',
      price: 12500000,
      area: 52,
      bedrooms: 2,
      photos: leninskyPhotos,
    },
    totalCommissionRate: 4.5,
    commissionShare: 25,
    status: 'ACTIVE',
    createdAt: '2024-01-24T09:15:00.000000',
    updatedAt: '2024-01-25T17:40:00.000000',
  },
];

export const fetchLeads = async (): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLeads.filter(lead => lead.status === 'ACTIVE');
};

export const fetchObjects = async (): Promise<RealEstateObject[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockObjects.filter(obj => obj.status === 'ACTIVE');
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLeads.find(lead => lead.id === id) || null;
};

export const getObjectById = async (id: string): Promise<RealEstateObject | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockObjects.find(obj => obj.id === id) || null;
};

export const getObjectsForLead = async (): Promise<RealEstateObject[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockObjects.filter(obj => obj.status === 'ACTIVE');
};

export const getLeadsForObject = async (): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLeads.filter(lead => lead.status === 'ACTIVE');
};