export interface Token {
  session: string;
  refresh: string;
}

interface BasicResponse {
  result: 'ok' | 'error';
}

export interface SuccessAuthResponse extends BasicResponse {
  result: 'ok';
  token: Token;
}

export interface ErrorAuthResponse extends BasicResponse {
  result: 'error';
}

export type AuthResponse = SuccessAuthResponse | ErrorAuthResponse;
