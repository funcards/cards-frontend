import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

import { baseQuery } from './rtk.query'

import { RootState } from '~src/store'
import { signIn, signOut } from '~src/modules/auth/auth.slice'
import { Tokens } from '~src/modules/auth/auth.types'

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(true)(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const token = (api.getState() as RootState).auth.tokens?.refresh_token
    const refreshResult = await baseQuery(false)(
      { url: 'refresh-token', method: 'POST', body: { token } },
      api,
      extraOptions
    )
    if (refreshResult.data) {
      api.dispatch(signIn(refreshResult.data as Tokens))
      result = await baseQuery(true)(args, api, extraOptions)
    } else {
      api.dispatch(signOut())
    }
  }

  return result
}
