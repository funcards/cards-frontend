import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { apiV1 } from '~src/utils/constants'
import { prepareHeaders } from '~src/utils/helpers'
import { SignIn, SignUp, Tokens } from './auth.types'
import { addCached } from '~src/modules/notification/notification.slice'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiV1, prepareHeaders }),
  endpoints: (build) => ({
    signIn: build.mutation<Tokens, SignIn>({
      query: (credentials) => ({ url: 'sign-in', method: 'POST', body: credentials }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCached(e.error.data))
        }
      },
    }),
    signUp: build.mutation<Tokens, SignUp>({
      query: (data) => ({ url: 'sign-up', method: 'POST', body: data }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
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
