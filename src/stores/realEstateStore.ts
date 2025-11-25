import { RealEstateObject } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';

class RealEstateStore {
  objects: RealEstateObject[] = [];

  constructor() {
    makeObservable(this, {
      objects: observable,
      setObjects: action,
    });
  }

  setObjects(objects: RealEstateObject[]) {
    this.objects = objects;
  }

  getObjectById(id: string): RealEstateObject | undefined {
    return this.objects.find(object => object.id === id);
  }
}

export const realEstateStore = new RealEstateStore();
