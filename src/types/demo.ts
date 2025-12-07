export interface DemoUser {
  user: {
    id: number;
    username: string;
  };
  chat: {
    id: number;
  };
}

export type DemoUserKey = 'bob' | 'alice';

export const demoUsers: Record<DemoUserKey, DemoUser> = {
  bob: {
    user: {
      id: 1,
      username: "bob"
    },
    chat: {
      id: 1
    }
  },
  alice: {
    user: {
      id: 2,
      username: "alice"
    },
    chat: {
      id: 2
    }
  }
};
