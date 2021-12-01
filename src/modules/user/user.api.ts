import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '~src/utils/rtk.query.reauth'
import { User } from './user.types'
import { addCaught } from '~src/modules/notification/notification.slice'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    me: build.query<User, void>({
      query: () => ({ url: 'users/me', method: 'GET' }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCaught(e.error.data))
        }
      },
    })
  }),
})

export const { useMeQuery } = userApi
