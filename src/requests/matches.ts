import { Match, MatchLog, MatchStatus } from '@/types/matching';
import { apiClient } from './client';

export const getMatchById = (id: string): Promise<Match> => {
  return apiClient.get<Match>(`/matches/${id}`);
};

export const getMatchLogs = (matchId: string): Promise<MatchLog[]> => {
  return apiClient.get<MatchLog[]>(`/match-logs/${matchId}`);
};

interface CreateMatchRequest {
  leadId: string;
  estateId: string;
  leadCommission?: number;
  updatedBy: string;
  comment?: string;
  status: MatchStatus;
}

export const createMatch = async (req: CreateMatchRequest): Promise<Match> => {
  const resp = await apiClient.post('/matches', req);
  return await resp.json();
};

interface UpdateMatchRequest {
  id: string;
  leadCommission?: number;
  updatedBy: string;
  comment?: string;
  status: MatchStatus;
}

export const updateMatch = async (req: UpdateMatchRequest): Promise<Match> => {
  const resp = await apiClient.put(`/matches/${req.id}`, req);
  return await resp.json();
};
