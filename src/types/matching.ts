export type MatchStatus = 'COMMISSION' | 'LIKED' | 'DISLIKE' | 'ACCEPTED' | 'UNDEFINED' | 'DECLINED';

export interface Match {
  id: string;
  leadId: string;
  estateId: string;
  leadStatus: MatchStatus;
  estateStatus: MatchStatus;
  leadCommission: number;
  userType: string;
}

export interface MatchLog {
  matchId: string;
  status: MatchStatus;
  leadCommission: number;
  userType: string;
  createdAt: string;
}
