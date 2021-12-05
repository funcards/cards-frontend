import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '~src/store'
import { toRecord } from '~src/utils/helpers'

const collection = { ids: [], items: {} }
const selectBoardId = (state: RootState, boardId: string) => boardId
const selectBoardIdAndCategoryId = (state: RootState, ids: { boardId: string; categoryId: string }) => ids

export const selectBoardSate = (state: RootState) => state.board
export const selectBoard = createSelector([selectBoardSate, selectBoardId], (state, boardId) =>
  boardId in state.items ? state.items[boardId] : undefined
)
export const selectCategories = createSelector([selectBoard], (board) =>
  board?.categories ? board.categories : collection
)
export const selectCategoryCards = createSelector(
  [selectBoardSate, selectBoardIdAndCategoryId],
  (state, { boardId, categoryId }) => {
    const board = boardId in state.items ? state.items[boardId] : undefined
    if (!board?.cards) {
      return collection
    }

    const ids = board.cards.ids.filter((v) => board.cards?.items[v].category_id === categoryId)
    const items = toRecord(
      Object.values(board.cards.items).filter((v) => v.category_id === categoryId),
      'card_id'
    )

    return { ids, items }
  }
)
