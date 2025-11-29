import { CreateLeadDto, Lead, RealEstateObject, UpdateLeadDto } from '@/types/entity';
import { apiClient } from './client';

export const getLeads = async (userId: string): Promise<Lead[]> => {
  const leads = await apiClient.get<Lead[]>(`/api/leads/user/${userId}`);
  return leads.map(lead => ({
    ...lead,
    type: 'lead',
  }));
};

export const getRealEstateObjects = async (userId: string): Promise<RealEstateObject[]> => {
  const objects = await apiClient.get<RealEstateObject[]>(`api/estates/${userId}`);
  return objects.map(object => ({
    ...object,
    type: 'object',
  }));
};

export const getLeadById = (leadId: string): Promise<Lead> => {
  return apiClient.get<Lead>(`api/leads/${leadId}`);
};

export const createLead = (lead: CreateLeadDto): Promise<Lead> => {
  return apiClient.post<Lead>(`api/leads`, lead);
};

export const updateLead = async (leadId: string, lead: UpdateLeadDto): Promise<Lead> => {
  const response = await apiClient.put(`api/leads/${leadId}`, lead);
  return response.json();
};

export const deleteLead = async (leadId: string): Promise<void> => {
  await apiClient.delete(`api/leads/${leadId}`);
};

