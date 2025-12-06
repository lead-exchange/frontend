import { User } from '@/types/user';
import { apiClient } from './client';

export const getCurrentUser = (): Promise<User> => {
  return apiClient.get<User>(`/api/users`);
};

export const setUserPhone = (phone: string): Promise<Response> => {
  return apiClient.patch(`/api/users/phone?phone=${phone}`);
};

export const setUserAcceptedTerms = async (): Promise<Response> => {
  await apiClient.patch(`/api/users/offer1-sign`);

  return await apiClient.patch(`/api/users/offer2-sign`);
};
