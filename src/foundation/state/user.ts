import {SuccessAuthResponse} from '@app/api/mangadex/types';

export interface User {
  username: string;
}

export interface Session {
  value: string;
  validUntil: number;
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

export function isSessionValid(session: Session) {
  const now = new Date();
  const then = new Date(session.validUntil);

  return then > now;
}

export function tokenInfoFromAuthResponse(
  response: SuccessAuthResponse,
): TokenInfo {
  const {token} = response;

  return {
    session: {
      value: token.session,
      validUntil: new Date(new Date().getTime() + 14 * 60 * 1000).getTime(), // 14 minutes
    },
    refresh: {
      value: token.refresh,
      validUntil: new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days
      ).getTime(),
    },
  };
}
