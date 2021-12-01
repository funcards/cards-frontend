import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'

import { RootState } from '~src/store'
import { apiV1 } from '~src/utils/constants'

export function prepareHeaders(headers: Headers, { getState }: { getState: () => unknown }): Headers {
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  const token = (getState() as RootState).auth.tokens?.access_token

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

export const baseQuery = fetchBaseQuery({ baseUrl: apiV1, prepareHeaders })
