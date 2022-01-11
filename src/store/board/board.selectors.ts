import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../index'

import { Category, Tag, Card } from './board.types'

const defaultCards: Card[] = []
const defaultCategories: Category[] = []
const defaultTags: Tag[] = []

const selectBoardId = (state: RootState, boardId: string) => boardId
const selectBoardIdAndCategoryId = (state: RootState, ids: { boardId: string; categoryId: string }) => ids
const selectBoardIdAndTagsId = (state: RootState, ids: { boardId: string; tagsId: string[] }) => ids

export const selectBoardState = (state: RootState) => state.board
export const selectBoard = createSelector([selectBoardState, selectBoardId], (state, boardId) =>
  state.boards.find((b) => b.board_id === boardId)
)
export const selectCategories = createSelector([selectBoard], (board) => board?.categories ?? defaultCategories)
export const selectTags = createSelector(
  [selectBoardState, selectBoardIdAndTagsId],
  (state, { boardId, tagsId }) =>
    state.boards.find((b) => b.board_id === boardId)?.tags?.filter((t) => tagsId.indexOf(t.tag_id) > -1) ?? defaultTags
)
export const selectCards = createSelector([selectBoard], (board) => board?.cards ?? defaultCards)
export const selectCategoryCards = createSelector(
  [selectBoardState, selectBoardIdAndCategoryId],
  (state, { boardId, categoryId }) =>
    state.boards.find((b) => b.board_id === boardId)?.cards?.filter((c) => c.category_id === categoryId) ?? defaultCards
)
