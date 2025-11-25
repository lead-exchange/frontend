import { Match } from '@/types/matching';
import { action, makeObservable, observable } from 'mobx';

class MatchesByEntitiesStore {
  matches: Map<string, Match[]> = new Map();

  constructor() {
    makeObservable(this, {
      matches: observable,
      setMatches: action,
      putMatch: action,
    });
  }

  setMatches(id: string, matches: Match[]) {
    this.matches.set(id, matches);
  }

  putMatch(id: string, match: Match) {
    const entityMatches = this.matches.get(id) || [];

    const idx = entityMatches.findIndex(item => item.id === match.id);
    if (idx === -1) {
      entityMatches.push(match);
    } else {
      entityMatches[idx] = match;
    }

    this.matches.set(id, entityMatches);
  }

  getMatchesByEntity(id: string): Match[] {
    return this.matches.get(id) || [];
  }

  getMatchById(entityId: string, matchId: string): Match | undefined {
    return this.getMatchesByEntity(entityId).find(match => match.id === matchId);
  }
}

export const leadMatchesStore = new MatchesByEntitiesStore();

export const objectMatchesStore = new MatchesByEntitiesStore();
