import { User } from '@/types/user';
import { action, makeObservable, observable } from 'mobx';

class UserStore {
  user?: User;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
    });
  }

  setUser(user: User) {
    this.user = user;
  }
}

export const userStore = new UserStore();
