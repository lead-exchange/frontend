import { RealEstateObject } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';
import { userStore } from './userStore';
import { getRealEstateObjects } from '@/requests/entities';
import { USER_ID } from '@/services/entityService';

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
    const userId = userStore.user?.id || USER_ID;
    const objects = await getRealEstateObjects(userId);
    this.setObjects(objects);
  }
}

export const realEstateStore = new RealEstateStore();
