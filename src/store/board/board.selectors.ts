import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../index'

import { Card, Category, Tag } from './board.types'

const defaultCategories: Category[] = []
const defaultTags: Tag[] = []
const defaultCards: Card[] = []

const selectBoardId = (state: RootState, boardId: string) => boardId
const selectBoardIdAndCategoryId = (state: RootState, ids: { boardId: string; categoryId: string }) => ids
const selectBoardIdAndTagsId = (state: RootState, ids: { boardId: string; tagsId: string[] }) => ids

export const selectBoardState = (state: RootState) => state.board
export const selectBoards = (state: RootState) => state.board.boards
export const selectBoard = createSelector([selectBoardState, selectBoardId], (state, boardId) =>
  state.boards.find((b) => b.board_id === boardId)
)
export const selectCategories = createSelector([selectBoard], (board) => board?.categories ?? defaultCategories)
export const selectTags = createSelector([selectBoardState, selectBoardIdAndTagsId], (state, { boardId, tagsId }) => {
  const board = state.boards.find((b) => b.board_id === boardId)
  if (!board?.cards) {
    return defaultTags
  }

  return board!.tags!.filter((t) => tagsId.indexOf(t.tag_id) > -1)
})
export const selectCards = createSelector([selectBoard], (board) => board?.cards ?? defaultCards)
export const selectCategoryCards = createSelector(
  [selectBoardState, selectBoardIdAndCategoryId],
  (state, { boardId, categoryId }) => {
    const board = state.boards.find((b) => b.board_id === boardId)
    if (!board?.cards) {
      return defaultCards
    }

    return board!.cards!.filter((c) => c.category_id === categoryId)
  }
)
