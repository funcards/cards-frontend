import axios from 'axios'
import createAuthRefreshInterceptor, { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { apiUrl, endpoints } from '~src/utils/constants'
import { store } from '~src/store'
import { getAuth } from '~src/store/selectors'
import { clearAuth, setTokens } from '~src/store/auth/auth.slice'

export default function axiosConfig(): void {
  axios.defaults.baseURL = apiUrl
  axios.defaults.withCredentials = true

  const refresh = (failedRequest: any) => {
    const { tokens } = getAuth(store.getState())

    if (!tokens) {
      return Promise.reject(failedRequest)
    }

    return axios
      .post(endpoints.auth.refreshToken, { token: tokens.refreshToken })
      .then((response) => {
        store.dispatch(
          setTokens({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
          })
        )
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token

        return Promise.resolve()
      })
      .catch((error) => {
        store.dispatch(clearAuth())
        throw error
      })
  }

  createAuthRefreshInterceptor(axios, refresh)

  axios.interceptors.request.use((config: AxiosAuthRefreshRequestConfig) => {
    const { tokens } = getAuth(store.getState())

    const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...config.headers }

    if (!tokens || config?.skipAuthRefresh) {
      return { ...config, headers }
    }

    return { ...config, headers: { ...headers, Authorization: `Bearer ${tokens?.accessToken}` } }
  })
}
