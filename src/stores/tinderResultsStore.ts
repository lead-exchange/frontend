import { Lead, RealEstateObject } from '@/types/entity';
import { action, computed, makeObservable, observable } from 'mobx';

class TinderResultsStore {
  likedItems: (Lead | RealEstateObject)[] = [];
  dislikedItems: (Lead | RealEstateObject)[] = [];
  customShareItems: (Lead | RealEstateObject)[] = [];

  constructor() {
    makeObservable(this, {
      likedItems: observable,
      dislikedItems: observable,
      customShareItems: observable,
      addLiked: action,
      addDisliked: action,
      addCustomShare: action,
      clear: action,
      total: computed,
    });
  }

  addLiked(item: Lead | RealEstateObject) {
    this.likedItems.push(item);
  }

  addDisliked(item: Lead | RealEstateObject) {
    this.dislikedItems.push(item);
  }

  addCustomShare(item: Lead | RealEstateObject) {
    this.customShareItems.push(item);
  }

  clear() {
    this.likedItems = [];
    this.dislikedItems = [];
    this.customShareItems = [];
  }

  get total() {
    return this.likedItems.length + this.dislikedItems.length + this.customShareItems.length;
  }
}

export const tinderResultsStore = new TinderResultsStore();
