import { RootState } from '~src/store'
import { fetchBaseQuery } from '~node_modules/@reduxjs/toolkit/dist/query'
import { apiV1 } from '~src/utils/constants'

export function prepareHeaders(withToken: boolean = true) {
  return (headers: Headers, { getState }: { getState: () => unknown }): Headers => {
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    if (withToken) {
      const token = (getState() as RootState).auth.tokens?.access_token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }

    return headers
  }
}

export const baseQuery = (withToken: boolean) =>
  fetchBaseQuery({ baseUrl: apiV1, prepareHeaders: prepareHeaders(withToken) })
