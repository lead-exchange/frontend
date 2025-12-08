export type MatchStatus = 'COMMISSION' | 'LIKED' | 'DISLIKED' | 'ACCEPTED' | 'UNDEFINED' | 'DECLINED';

export interface Match {
  id: string;
  leadId: string;
  estateId: string;
  leadStatus: MatchStatus;
  estateStatus: MatchStatus;
  commonStatus: string;
  leadCommission: number;
  userType: string;
}

export interface LeadMatch extends Match {
  estateTitle: string;
  estatePhoto: string;
}

export interface ObjectMatch extends Match {
  leadName: string;
}

export interface MatchLog {
  matchId: string;
  status: MatchStatus;
  leadCommission: number;
  userType: string;
  createdAt: string;
}
