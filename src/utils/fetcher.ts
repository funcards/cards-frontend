import axios from 'axios'
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { apiV1 } from './constants'

import { store } from '~src/store'
import { selectAuthState } from '~src/modules/auth/auth.selectors'
import { setTokens, signOut } from '~src/modules/auth/auth.slice'
import { ErrorResponse } from '~src/modules/common/common.types'

export const toErrorResponse = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response?.data as ErrorResponse
  }

  return { status: 500, type: 'ClientError', title: 'Error', message: (error as Error).message }
}

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
    .post('/refresh-token', { token: tokens.refresh_token })
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
