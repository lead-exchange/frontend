import { Lead, RealEstateObject } from '@/types/entity';
import { apiClient } from './client';

export const getObjectsForLead = async (id: string): Promise<RealEstateObject[]> => {
  const objects = await apiClient.get<RealEstateObject[]>(`/recommendations/forLead/${id}`);
  return objects.map(object => ({
    ...object,
    type: 'object',
  }));
};

export const getLeadsForObject = async (id: string): Promise<Lead[]> => {
  const leads = await apiClient.get<Lead[]>(`/recommendations/forEstate/${id}`);
  return leads.map(lead => ({
    ...lead,
    type: 'lead',
  }));
};
