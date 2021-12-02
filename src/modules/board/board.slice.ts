import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Board, BoardState } from './board.types'
import { boardApi } from './board.api'

export const boardAdapter = createEntityAdapter<Board>({
  selectId: (board) => board.board_id,
  sortComparer: (a, b) => b.created_at.diff(a.created_at),
})

const boardSlice = createSlice({
  name: 'boards',
  initialState: boardAdapter.getInitialState(),
  reducers: {
    removeAll: (state: BoardState) => {
      boardAdapter.removeAll(state)
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(boardApi.endpoints.getBoards.matchFulfilled, (state: BoardState, { payload }: PayloadAction<Board[]>) => {
        boardAdapter.setAll(state, payload)
      })
      .addMatcher(boardApi.endpoints.getBoard.matchFulfilled, (state: BoardState, { payload }: PayloadAction<Board>) => {
        boardAdapter.upsertOne(state, payload)
      })
  }
})

export const { removeAll } = boardSlice.actions
export default boardSlice.reducer
