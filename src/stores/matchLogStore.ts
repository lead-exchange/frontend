import { MatchLog } from '@/types/matching';
import { action, makeObservable, observable } from 'mobx';

class MatchLogStore {
  logs: Map<string, MatchLog[]> = new Map();

  constructor() {
    makeObservable(this, {
      logs: observable,
      setLogs: action,
    });
  }

  setLogs(matchId: string, logs: MatchLog[]) {
    return this.logs.set(matchId, logs);
  }

  getLogsByMatch(matchId: string) {
    return this.logs.get(matchId);
  }
}

export const matchLogStore = new MatchLogStore();
