import { User } from '@/types/user';
import { apiClient } from './client';

export const getUserByTgId = (tgId: number): Promise<User> => {
  return apiClient.get<User>(`/users/${tgId}`);
};
