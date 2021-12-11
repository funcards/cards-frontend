import axios from 'axios'
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { apiV1 } from '../constants'

import { store } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { setTokens, signOut } from '~src/store/auth/auth.slice'

export interface FetcherConfig extends AxiosAuthRefreshRequestConfig {
  accessToken?: string
}

export const fetcher = axios.create({
  baseURL: apiV1,
  withCredentials: true,
})

const refresh = (failedRequest: any) => {
  const { tokens } = selectAuthState(store.getState())

  if (!tokens) {
    return Promise.reject(failedRequest)
  }

  return fetcher
    .post('/refresh-token', { token: tokens.refresh_token }, { skipAuthRefresh: true } as AxiosAuthRefreshRequestConfig)
    .then((response) => {
      store.dispatch(setTokens(response.data))
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token

      return Promise.resolve()
    })
    .catch((error) => {
      store.dispatch(signOut())
      throw error
    })
}

createAuthRefreshInterceptor(fetcher, refresh)

fetcher.interceptors.request.use((config: FetcherConfig) => {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...config.headers }

  let { accessToken } = config

  if (!accessToken) {
    const { tokens } = selectAuthState(store.getState())

    if (tokens) {
      accessToken = tokens.access_token
    }
  }

  if (!accessToken || config?.skipAuthRefresh) {
    return { ...config, headers }
  }

  return { ...config, headers: { ...headers, Authorization: `Bearer ${accessToken}` } }
})
