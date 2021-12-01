import { createApi } from '@reduxjs/toolkit/query/react'

import { SignIn, SignUp, Tokens } from './auth.types'
import { addCached } from '~src/modules/notification/notification.slice'
import { baseQuery } from '~src/utils/rtk.query'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery(false),
  endpoints: (build) => ({
    signIn: build.mutation<Tokens, SignIn>({
      query: (credentials) => ({ url: 'sign-in', method: 'POST', body: credentials }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCached(e.error.data))
        }
      },
    }),
    signUp: build.mutation<Tokens, SignUp>({
      query: (data) => ({ url: 'sign-up', method: 'POST', body: data }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCached(e.error.data))
        }
      },
    }),
  })
})

export const { useSignInMutation, useSignUpMutation } = authApi
