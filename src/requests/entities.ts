import { CreateLeadDto, Lead, RealEstateObject, UpdateLeadDto } from '@/types/entity';
import { apiClient } from './client';

export const getLeads = async (): Promise<Lead[]> => {
  const leads = await apiClient.get<Lead[]>(`/api/leads`);
  return leads.map(lead => ({
    ...lead,
    type: 'lead',
  }));
};

export const getRealEstateObjects = async (): Promise<RealEstateObject[]> => {
  const objects = await apiClient.get<RealEstateObject[]>(`/api/estates`);
  return objects.map(object => {
    return {
      ...object,
      type: 'object',
    };
  });
};

export const getLeadById = async (leadId: string): Promise<Lead> => {
  const resp = await apiClient.get<Lead>(`/api/leads/${leadId}`);
  return { ...resp, type: 'lead' };
};

export const getEstateById = async (estateId: string): Promise<RealEstateObject> => {
  const resp = await apiClient.get<RealEstateObject>(`/api/estates/${estateId}`);
  return { ...resp, type: 'object' };
};

export const createLead = async (lead: CreateLeadDto): Promise<Lead> => {
  const leadResp = await apiClient.post<Lead>(`/api/leads`, lead);
  return { ...leadResp, type: 'lead' };
};

export const updateLead = async (leadId: string, lead: UpdateLeadDto): Promise<Lead> => {
  return await apiClient.put<Lead>(`/api/leads/${leadId}`, lead);
};

export const archiveLead = async (leadId: string): Promise<Lead> => {
  const leadResp = await apiClient.post<Lead>(`/api/leads/${leadId}/archive`);
  return { ...leadResp, type: 'lead' };
};

export const unarchiveLead = async (leadId: string): Promise<Lead> => {
  const leadResp = await apiClient.post<Lead>(`/api/leads/${leadId}/unarchive`);
  return { ...leadResp, type: 'lead' };
};

export const archiveEstate = async (estateId: string): Promise<RealEstateObject> => {
  const resp = await apiClient.post<RealEstateObject>(`/api/estates/${estateId}/archive`);
  return { ...resp, type: 'object' };
};

export const unarchiveEstate = async (estateId: string): Promise<RealEstateObject> => {
  const resp = await apiClient.post<RealEstateObject>(`/api/estates/${estateId}/unarchive`);
  return { ...resp, type: 'object' };
};

export const deleteLead = async (leadId: string): Promise<void> => {
  await apiClient.delete(`/api/leads/${leadId}`);
};
