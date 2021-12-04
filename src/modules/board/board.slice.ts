import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import { Board, BoardState, BoardStateStatus, DraftBoard } from './board.types'

import { ErrorResponse } from '~src/modules/common/common.types'

export const boardAdapter = createEntityAdapter<Board>({
  selectId: (board) => board.board_id,
  sortComparer: (a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)),
})

const initialState: BoardState = boardAdapter.getInitialState({
  isLoading: false,
  isError: false,
  newBoardIsOpen: false,
})

const init = (state: BoardState, status: string) => {
  state.isLoading = true
  state.isError = false
  state.error = undefined
  state.status = status
}

const end = (state: BoardState, status?: string) => {
  state.isLoading = false
  state.isError = false
  state.error = undefined
  state.status = status
}

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    success: (state: BoardState) => end(state, BoardStateStatus.Success),
    failed: (state: BoardState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isLoading = false
      state.isError = true
      state.error = payload
      state.status = BoardStateStatus.Error
    },
    clear: (state: BoardState) => {
      end(state)
      state.newBoardIsOpen = false
      boardAdapter.removeAll(state)
    },
    newBoard: (state: BoardState, {}: PayloadAction<DraftBoard>) => init(state, BoardStateStatus.NewBoard),
    openNewBoard: (state: BoardState) => {
      state.newBoardIsOpen = true
    },
    closeNewBoard: (state: BoardState) => {
      state.newBoardIsOpen = false
    },
    loadBoards: (state: BoardState) => init(state, BoardStateStatus.LoadBoardList),
    loadBoard: (state: BoardState, {}: PayloadAction<string>) => init(state, BoardStateStatus.LoadOneBoard),
    setBoards: (state: BoardState, { payload }: PayloadAction<Board[]>) => boardAdapter.setAll(state, payload),
    upsertBoard: (state: BoardState, { payload }: PayloadAction<Board>) => boardAdapter.upsertOne(state, payload),
  },
})

export const {
  success,
  failed,
  clear,
  newBoard,
  openNewBoard,
  closeNewBoard,
  loadBoards,
  loadBoard,
  setBoards,
  upsertBoard,
} = boardSlice.actions
export default boardSlice.reducer
