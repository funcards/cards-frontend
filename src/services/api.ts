import axios from 'axios';
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

import { selectAuth, signOut, store, setTokens } from '@/store';
import { apiUrl } from '@/config';
import { noUndefined } from '@/helpers';

export interface RequestConfig extends AxiosAuthRefreshRequestConfig {
  accessToken?: string;
}

export const request = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const refresh = (failedRequest: any) => {
  const { tokens } = selectAuth(store.getState());

  if (!tokens) {
    return Promise.reject(failedRequest);
  }

  return request
    .post('/refresh-token', { token: tokens.refresh_token }, { skipAuthRefresh: true } as AxiosAuthRefreshRequestConfig)
    .then((response) => {
      store.dispatch(setTokens(response.data));
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;

      return Promise.resolve();
    })
    .catch((error) => {
      store.dispatch(signOut());
      throw error;
    });
};

createAuthRefreshInterceptor(request, refresh);

request.interceptors.request.use((config: RequestConfig) => {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...config.headers };

  let { accessToken } = config;

  if (!accessToken) {
    const { tokens } = selectAuth(store.getState());

    if (tokens) {
      accessToken = tokens.access_token;
    }
  }

  if (!accessToken || config?.skipAuthRefresh) {
    return { ...config, headers };
  }

  return { ...config, headers: { ...headers, Authorization: `Bearer ${accessToken}` } };
});

export class Api {
  public static create<T>(url: string, payload: T): Promise<string> {
    return request.post(url, payload).then(({ headers }) => {
      if ('location' in headers) {
        const id = headers['location'].split('/').pop();
        if (id) {
          return id;
        }
      }

      throw new Error('Location header not found.');
    });
  }

  public static read<T>(url: string): Promise<T> {
    return request.get<T>(url).then(({ data }) => data);
  }

  public static update<T>(url: string, payload: T): Promise<void> {
    return request.patch(url, noUndefined(payload)).then(() => {});
  }

  public static delete(url: string): Promise<void> {
    return request.delete(url).then(() => {});
  }
}
