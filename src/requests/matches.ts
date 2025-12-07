import { ObjectMatch, Match, MatchLog, MatchStatus, LeadMatch } from '@/types/matching';
import { apiClient } from './client';

export const getMatchById = (id: string): Promise<Match> => {
  return apiClient.get<Match>(`/api/matches/${id}`);
};

export const getLeadMatches = (id: string): Promise<LeadMatch[]> => {
  return apiClient.get<LeadMatch[]>(`/api/matches/lead/${id}`);
};

export const getObjectMatches = (id: string): Promise<ObjectMatch[]> => {
  return apiClient.get<ObjectMatch[]>(`/api/matches/estate/${id}`);
};

export const getMatchLogs = (matchId: string): Promise<MatchLog[]> => {
  return apiClient.get<MatchLog[]>(`/api/match-logs/${matchId}`);
};

interface CreateMatchRequest {
  leadId: string;
  estateId: string;
  leadCommission: number;
  updatedBy: string;
  comment?: string;
  status: MatchStatus;
}

export const createMatch = async (req: CreateMatchRequest): Promise<Match> => {
  return apiClient.post('/api/matches', req);
};

interface UpdateMatchRequest {
  id: string;
  leadCommission: number;
  updatedBy: string;
  comment?: string;
  status: MatchStatus;
}

export const updateMatch = async (req: UpdateMatchRequest): Promise<Match> => {
  return await apiClient.put<Match>(`/api/matches/${req.id}`, req);
};
