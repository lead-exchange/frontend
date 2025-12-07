import { getCurrentUser } from '@/requests/user';
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

  async getUser(): Promise<User> {
    if (this.user) {
      return this.user;
    }

    try {
      const user: User = await getCurrentUser();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Ошибка при загрузке пользователя:', error);
      // Пробрасываем оригинальную ошибку для корректной обработки выше
      throw error;
    }
  }
}

export const userStore = new UserStore();
