import { createApi } from '@reduxjs/toolkit/query/react'
import querystring from 'query-string'

import { baseQueryWithReauth } from '~src/utils/rtk.query.reauth'
import { User } from './user.types'
import { addCaught } from '~src/modules/notification/notification.slice'
import { PaginatedResponse } from '~src/modules/common/common.types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (build) => ({
    me: build.query<User, void>({
      query: () => ({ url: 'users/me', method: 'GET' }),
      providesTags: (result) => result
        ? [{ type: 'User' as const, id: result.user_id }]
        : [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCaught(e.error.data))
        }
      },
    }),
    getUsers: build.query<User[], string[]>({
      query: (ids) => ({ url: `users?${querystring.stringify({users: ids}, {arrayFormat: 'bracket'})}`, method: 'GET' }),
      providesTags: (result) => result ? [
        ...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })),
        { type: 'User', id: 'LIST' },
      ] : [{ type: 'User', id: 'LIST' }],
      transformResponse(response: PaginatedResponse<User>) {
        return response.data
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCaught(e.error.data))
        }
      },
    }),
  }),
})

export const { useMeQuery } = userApi
