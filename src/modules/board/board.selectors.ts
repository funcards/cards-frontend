import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '~src/store'
import { boardAdapter } from './board.slice'

const selectSateBoard = (state: RootState) => state.board
const selectBoardId = (state: RootState, boardId: string) => boardId

export const getBoards = createSelector(
  [selectSateBoard],
  (state) => boardAdapter.getSelectors().selectEntities(state),
)

export const getBoard = createSelector(
  [selectSateBoard, selectBoardId],
  (state, boardId) => boardAdapter.getSelectors().selectById(state, boardId),
)
