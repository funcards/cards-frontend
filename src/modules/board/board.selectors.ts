import { createSelector } from '@reduxjs/toolkit'

import { boardAdapter } from './board.slice'

import { RootState } from '~src/store'

const selectBoardId = (state: RootState, boardId: string) => boardId

export const selectBoardSate = (state: RootState) => state.board
export const selectBoardList = (state: RootState) => boardAdapter.getSelectors().selectAll(state.board)
export const selectBoard = createSelector([selectBoardSate, selectBoardId], (state, boardId) =>
  boardAdapter.getSelectors().selectById(state, boardId)
)
