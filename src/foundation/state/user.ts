export interface User {
  username: string;
  id: string;
}

export interface Session {
  value: string;
  validUntil: Date;
}

export interface TokenInfo {
  session: Session;
  refresh: Session;
}

export interface UserStore {
  user: User | null;
  token: TokenInfo | null;
}

export const defaultUserStore: UserStore = {
  user: null,
  token: null,
};
