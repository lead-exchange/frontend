import { RealEstateObject } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';
import { getRealEstateObjects } from '@/requests/entities';

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

  async getObjectById(id: string): Promise<RealEstateObject | undefined> {
    await this.assertObjectsAreLoaded();
    return this.objects && this.objects.find(object => object.id === id);
  }

  async assertObjectsAreLoaded() {
    if (this.objects.length === 0) {
      await this.loadObjects();
    }
  }

  async loadObjects() {
    const objects = await getRealEstateObjects();
    this.setObjects(objects);
  }
}

export const realEstateStore = new RealEstateStore();
