import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '~src/utils/rtk.query.reauth'
import { Board } from './board.types'
import { PaginatedResponse } from '~src/modules/common/common.types'
import { addCaught } from '~src/modules/notification/notification.slice'

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Board'],
  endpoints: (build) => ({
    getBoards: build.query<Board[], void>({
      query: () => ({ url: 'boards', method: 'GET' }),
      providesTags: (result) => result ? [
        ...result.map(({ board_id }) => ({ type: 'Board' as const, id: board_id })),
        { type: 'Board', id: 'LIST' },
      ] : [{ type: 'Board', id: 'LIST' }],
      transformResponse(response: PaginatedResponse<Board>) {
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
    getBoard: build.query<Board, string>({
      query: (id) => ({ url: `boards/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Board', id }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (e) {
          dispatch(addCaught(e.error.data))
        }
      },
    }),
    // addBoard
    // updateBoard
    // deleteBoard
  }),
})

export const { useGetBoardsQuery, useGetBoardQuery } = boardApi
