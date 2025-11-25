import { Match } from '@/types/matching';
import { action, makeObservable, observable } from 'mobx';

class MatchStore {
  matches: Match[] = [];

  constructor() {
    makeObservable(this, {
      matches: observable,
      setMatches: action,
      addMatch: action,
    });
  }

  setMatches(matches: Match[]) {
    this.matches = matches;
  }

  addMatch(match: Match | null) {
    if (match === null) {
      return;
    }

    const idx = this.matches.findIndex(item => item.id === match.id);
    if (idx === -1) {
      this.matches.push(match);
    } else {
      this.matches[idx] = match;
    }
  }

  getMatchById(id: string): Match | undefined {
    return this.matches.find(match => match.id === id);
  }
}

export const matchStore = new MatchStore();
