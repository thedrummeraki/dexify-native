export interface User {
  username: string;
  id: string;
}

export interface UserStore {
  user: User | null;
}

export const defaultUserStore: UserStore = {
  user: null,
};
