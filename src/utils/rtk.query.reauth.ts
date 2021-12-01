import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery, retry } from '@reduxjs/toolkit/dist/query'

import { baseQuery } from './rtk.query'

import { RootState } from '~src/store'
import { signIn, signOut } from '~src/modules/auth/auth.slice'
import { Tokens } from '~src/modules/auth/auth.types'
import { apiV1 } from '~src/utils/constants'

const prepareHeaders = (headers: Headers): Headers => {
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  return headers
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const token = (api.getState() as RootState).auth.tokens?.refresh_token
    const refreshResult = await fetchBaseQuery({ baseUrl: apiV1, prepareHeaders })(
      { url: 'refresh-token', method: 'POST', body: { token } },
      api,
      extraOptions
    )
    if (refreshResult.data) {
      api.dispatch(signIn(refreshResult.data as Tokens))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(signOut())
    }
  }

  return result
}
