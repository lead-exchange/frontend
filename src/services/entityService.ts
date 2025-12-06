import type { Lead } from '@/types/entity';
import type { MatchLog } from '@/types/matching';

const BACKEND_URL = 'https://lead-exchange.ru';
export const USER_ID = '11111111-1111-1111-1111-111111111111';


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
      propertyType: 'commerce',
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


export const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/lead/${USER_ID}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    Array.isArray(data) ? data.filter((lead: Lead) => lead.status === 'ACTIVE') : [];
    return mockLeads.filter(lead => lead.status === 'ACTIVE');
  } catch (error) {
    console.warn('Failed to fetch leads from backend, using mock data:', error);
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockLeads.filter(lead => lead.status === 'ACTIVE');
  }
};


export const getLeadById = async (id: string): Promise<Lead | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLeads.find(lead => lead.id === id) || null;
};


export const getMatchLogs = async (id: string): Promise<MatchLog[] | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      matchId: id,
      status: 'ACCEPTED',
      leadCommission: 20,
      userType: 'object',
      createdAt: new Date(2025, 11, 23, 12, 0, 0, 0).toISOString(),
    },
  ];
};


export const getLeadsForObject = async (): Promise<Lead[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLeads.filter(lead => lead.status === 'ACTIVE');
};
