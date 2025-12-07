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
    const address = object.attributes.address;

    const displayName =
      object.attributes.title ||
      [
        address.cityName || address.regionName + (address.regionType ? ' ' + address.regionType : ''),
        address.streetName && (address.streetType ? address.streetType + ' ' : '') + address.streetName,
        address.house,
        address.flat,
      ]
        .filter(item => item)
        .join(', ') ||
      '';

    return {
      ...object,
      displayName: displayName,
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

export const archiveLead = async (leadId: string): Promise<void> => {
  await apiClient.post(`/api/leads/${leadId}/archive`);
};

export const unarchiveLead = async (leadId: string): Promise<void> => {
  await apiClient.post(`/api/leads/${leadId}/unarchive`);
};

export const archiveEstate = async (estateId: string): Promise<void> => {
  await apiClient.post(`/api/estates/${estateId}/archive`);
};

export const unarchiveEstate = async (estateId: string): Promise<void> => {
  await apiClient.post(`/api/estates/${estateId}/unarchive`);
};

export const deleteLead = async (leadId: string): Promise<void> => {
  await apiClient.delete(`/api/leads/${leadId}`);
};
