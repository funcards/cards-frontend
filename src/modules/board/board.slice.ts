import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Board, BoardState, DraftBoard } from './board.types'

import { ErrorResponse } from '~src/modules/common/common.types'

export const boardAdapter = createEntityAdapter<Board>({
  selectId: (board) => board.board_id,
  sortComparer: (a, b) => b.created_at.diff(a.created_at),
})

const initialState: BoardState = boardAdapter.getInitialState({
  isLoading: false,
  isError: false,
})

const init = (state: BoardState) => {
  state.isLoading = true
  state.isError = false
  state.error = undefined
}

const end = (state: BoardState) => {
  state.isLoading = false
  state.isError = false
  state.error = undefined
}

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    success: end,
    failed: (state: BoardState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isLoading = false
      state.isError = true
      state.error = payload
    },
    clear: (state: BoardState) => {
      end(state)
      boardAdapter.removeAll(state)
    },
    newBoard: (state: BoardState, {}: PayloadAction<DraftBoard>) => init(state),
    loadBoards: init,
    loadBoard: (state: BoardState, {}: PayloadAction<string>) => init(state),
    setBoards: (state: BoardState, { payload }: PayloadAction<Board[]>) => boardAdapter.setAll(state, payload),
    upsertBoard: (state: BoardState, { payload }: PayloadAction<Board>) => boardAdapter.upsertOne(state, payload),
  },
})

export const { success, failed, clear, newBoard, loadBoards, loadBoard, setBoards, upsertBoard } = boardSlice.actions
export default boardSlice.reducer
