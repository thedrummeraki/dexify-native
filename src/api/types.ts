import {AxiosError, AxiosResponse} from 'axios';

export enum ResponseStatus {
  Pending = 0,
  Initiated = 1,
  Successful = 2,
  Error = 3,
}
export interface RequestResult<T> {
  data?: T;
  response?: AxiosResponse<T>;
  status: ResponseStatus;
  loading: boolean;
  error?: AxiosError<T>;
}

export interface BasicRequestParams {
  hookUrl?: string;
  method: AxiosRequestType;
  refreshSession?: boolean;
  requireSession?: boolean;
  forceRefresh?: boolean;
  throwIfRefreshFails?: boolean;
}

export interface QueryRequestParams extends BasicRequestParams {
  method: AxiosRequestType.Get;
}

export interface MutatingRequestParams<Body> extends BasicRequestParams {
  method:
    | AxiosRequestType.Delete
    | AxiosRequestType.Post
    | AxiosRequestType.Put;
  data?: Body;
}

export type RequestParams<Body> =
  | QueryRequestParams
  | MutatingRequestParams<Body>;
export type SimpleRequestParams<Body> = Omit<
  RequestParams<Body>,
  'method' | 'hookUrl'
>;

export type LazyRequestResponse<T, Body = any> = readonly [
  (
    url?: string,
    body?: Body,
    callbackParams?: SimpleRequestParams<Body>,
  ) => Promise<T | undefined>,
  RequestResult<T>,
];

export enum AxiosRequestType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}
