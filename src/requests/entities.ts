import { Lead, RealEstateObject } from '@/types/entity';
import { apiClient } from './client';

export const getLeads = (userId: string): Promise<Lead[]> => {
  return apiClient.get<Lead[]>(`/lead/${userId}`);
};

export const getRealEstateObjects = (userId: string): Promise<RealEstateObject[]> => {
  return apiClient.get<RealEstateObject[]>(`/estate/${userId}`);
};
