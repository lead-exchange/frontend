import { Lead, RealEstateObject } from '@/types/entity';
import { apiClient } from './client';

export const getObjectsForLead = (id: string): Promise<RealEstateObject[]> => {
  return apiClient.get<RealEstateObject[]>(`/recommendations/forLead/${id}`);
};

export const getLeadsForObject = (id: string): Promise<Lead[]> => {
  return apiClient.get<Lead[]>(`/recommendations/forEstate/${id}`);
};
