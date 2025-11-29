import { Lead, RealEstateObject } from '@/types/entity';
import { apiClient } from './client';

export const getLeads = async (userId: string): Promise<Lead[]> => {
  const leads = await apiClient.get<Lead[]>(`/api/leads/user/${userId}`);
  return leads.map(lead => ({
    ...lead,
    type: 'lead',
  }));
};

export const getRealEstateObjects = async (userId: string): Promise<RealEstateObject[]> => {
  const objects = await apiClient.get<RealEstateObject[]>(`/api/estates/user/${userId}`);
  return objects.map(object => ({
    ...object,
    type: 'object',
  }));
};
