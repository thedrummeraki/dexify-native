import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  AxiosRequestType,
  LazyRequestResponse,
  RequestParams,
  RequestResult,
  ResponseStatus,
  SimpleRequestParams,
} from './types';
import {useCallback, useEffect, useState} from 'react';

export function useGetRequest<T>(
  url: string,
  params?: SimpleRequestParams<never>,
): RequestResult<T> {
  const [callback, result] = useLazyGetRequest<T>();

  useEffect(() => {
    callback(url, params);
    // TODO: Fix callback casing loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, params]);

  return {...result};
}

export function useLazyGetRequest<T, Body = any>(
  hookUrl?: string,
  params?: SimpleRequestParams<Body>,
) {
  const options = Object.assign(
    {
      hookUrl,
      method: AxiosRequestType.Get,
      refreshSession: true,
    },
    params,
  );

  return useAxiosRequest<T>(options);
}

export function useAxiosRequest<T, Body = any>(
  params: RequestParams<Body>,
): LazyRequestResponse<T> {
  const [data, setData] = useState<T>();
  const [response, setResponse] = useState<AxiosResponse<T>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T>>();
  const [status, setStatus] = useState(ResponseStatus.Pending);

  const callback = useCallback(
    async (callbackUrl?: string, body?: Body) => {
      const url = params.hookUrl || callbackUrl;
      if (!url) {
        throw new Error(
          'Missing url. Must be passed in from the hook or the callback',
        );
      }

      // const requestMethod = session
      //   ? `[${params.method}]`
      //   : `[?${params.method}]`;
      const requestMethod = `[${params.method}]`;
      const config: AxiosRequestConfig = {};

      // if (session) {
      //   // At this point, if the refreshResponse is undefined and the session
      //   // is present, then the session is valid.
      //   config.headers = {
      //     Authorization: `Bearer ${session.session.value}`,
      //     'x-auth-session': `Bearer ${session.session.value}`,
      //     'x-auth-refresh': session.refresh.value,
      //   };
      // }

      const requestConfig = config || {};

      console.log(
        requestMethod,
        url,
        'with header keys',
        Object.keys(config.headers || {}),
      );

      setStatus(ResponseStatus.Initiated);
      setLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const axiosResponse = await request<T, Body>(
          params.method,
          url,
          requestConfig,
          body,
        );
        setData(axiosResponse.data);
        setResponse(axiosResponse);
        setStatus(ResponseStatus.Successful);

        return axiosResponse.data;
        // eslint-disable-next-line @typescript-eslint/no-shadow, no-catch-shadow
      } catch (error) {
        setStatus(ResponseStatus.Error);
        if (axios.isAxiosError(error)) {
          setError(error as AxiosError<T>);
        } else {
          console.error('error while fetching', url, ':', error);
        }
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  return [callback, {data, loading, error, response, status}];
}

async function request<T, Body = any>(
  method: AxiosRequestType,
  url: string,
  config: AxiosRequestConfig,
  data?: Body,
) {
  switch (method) {
    case AxiosRequestType.Get:
      return await axios.get<T>(url, config);
    case AxiosRequestType.Post:
      return await axios.post<T>(url, data, config);
    case AxiosRequestType.Put:
      return await axios.put<T>(url, data, config);
    case AxiosRequestType.Delete:
      return await axios.delete<T>(url, config);
    default:
      throw new Error(
        `Unsupported method "${method}. Should be one of [${Object.values(
          AxiosRequestType,
        ).join(', ')}]"`,
      );
  }
}
