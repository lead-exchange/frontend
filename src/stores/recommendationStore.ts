import { Lead, RealEstateObject } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';

class RecommendationStore {
  leadMatches: Map<string, RealEstateObject[]> = new Map();

  objectMatches: Map<string, Lead[]> = new Map();

  constructor() {
    makeObservable(this, {
      leadMatches: observable,
      objectMatches: observable,
      setLeadMatches: action,
      setObjectMatches: action,
    });
  }

  setLeadMatches(id: string, matches: RealEstateObject[]) {
    this.leadMatches.set(id, matches);
  }

  setObjectMatches(id: string, matches: Lead[]) {
    this.objectMatches.set(id, matches);
  }
}

export const recsStore = new RecommendationStore();
