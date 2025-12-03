import { Match, LeadMatch, ObjectMatch } from '@/types/matching';
import { action, makeObservable, observable } from 'mobx';

class MatchesByEntitiesStore<T extends Match> {
  matches: Map<string, T[]> = new Map();

  constructor() {
    makeObservable(this, {
      matches: observable,
      setMatches: action,
      putMatch: action,
    });
  }

  setMatches(id: string, matches: T[]) {
    this.matches.set(id, matches);
  }

  putMatch(id: string, match: T) {
    const entityMatches = this.matches.get(id) || [];

    const idx = entityMatches.findIndex(item => item.id === match.id);
    if (idx === -1) {
      entityMatches.push(match);
    } else {
      entityMatches[idx] = match;
    }

    this.matches.set(id, entityMatches);
  }

  getMatchesByEntity(id: string): T[] {
    return this.matches.get(id) || [];
  }

  getMatchById(entityId: string, matchId: string): T | undefined {
    return this.getMatchesByEntity(entityId).find(match => match.id === matchId);
  }
}

export const leadMatchesStore = new MatchesByEntitiesStore<LeadMatch>();

export const objectMatchesStore = new MatchesByEntitiesStore<ObjectMatch>();
