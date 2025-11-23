import { RealEstateObject } from '@/types/entity';
import { makeAutoObservable } from 'mobx';

class RealEstateStore {
  objects: RealEstateObject[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setObjects(objects: RealEstateObject[]) {
    this.objects = objects;
  }

  getObjectById(id: string): RealEstateObject | undefined {
    return this.objects.find(object => object.id === id);
  }

  getObjects(): RealEstateObject[] {
    return this.objects;
  }
}

export const realEstateStore = new RealEstateStore();
