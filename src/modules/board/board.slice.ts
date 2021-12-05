import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import {
  Board,
  BoardState,
  BoardStateStatus,
  Card,
  Category,
  DraftBoard,
  DraftCard,
  DraftCategory,
  DraftTag,
  Tag,
} from './board.types'

import { ErrorResponse } from '~src/modules/common/common.types'
import { toRecord } from '~src/utils/helpers'

const initialState: BoardState = {
  ids: [],
  items: {},
  isLoading: false,
  isError: false,
  newBoardIsOpen: false,
}

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
    clear: () => initialState,
    loadBoards: (state: BoardState) => init(state, BoardStateStatus.LoadBoardList),
    loadBoard: (state: BoardState, {}: PayloadAction<string>) => init(state, BoardStateStatus.LoadOneBoard),
    setBoards: (state: BoardState, { payload }: PayloadAction<Board[]>) => {
      state.items = toRecord(payload, 'board_id')
      state.ids = Object.keys(state.items).sort((a, b) =>
        dayjs(state.items[b].created_at).diff(dayjs(state.items[a].created_at))
      )
    },
    setBoard: (state: BoardState, { payload }: PayloadAction<Board>) => {
      state.items[payload.board_id] = payload
      state.ids = Object.keys(state.items).sort((a, b) =>
        dayjs(state.items[b].created_at).diff(dayjs(state.items[a].created_at))
      )
    },
    setTags: (state: BoardState, { payload }: PayloadAction<{ board_id: string; tags: Tag[] }>) => {
      state.items[payload.board_id].tags = toRecord(payload.tags, 'tag_id')
    },
    setTag: (state: BoardState, { payload }: PayloadAction<Tag>) => {
      state.items[payload.board_id].tags = { ...state.items[payload.board_id].tags, [payload.tag_id]: payload }
    },
    setCategories: (state: BoardState, { payload }: PayloadAction<{ board_id: string; categories: Category[] }>) => {
      const items = toRecord(payload.categories, 'category_id')
      state.items[payload.board_id].categories = {
        ids: Object.keys(items).sort((a, b) => items[a].position - items[b].position),
        items,
      }
    },
    setCategory: (state: BoardState, { payload }: PayloadAction<Category>) => {
      state.items[payload.board_id].categories!.items[payload.category_id] = payload
      state.items[payload.board_id].categories!.ids = Object.keys(state.items[payload.board_id].categories!.items).sort(
        (a, b) =>
          state.items[payload.board_id].categories!.items[a].position -
          state.items[payload.board_id].categories!.items[b].position
      )
    },
    setCards: (state: BoardState, { payload }: PayloadAction<{ board_id: string; cards: Card[] }>) => {
      const items = toRecord(payload.cards, 'card_id')
      state.items[payload.board_id].cards = {
        ids: Object.keys(items).sort((a, b) => items[a].position - items[b].position),
        items,
      }
    },
    setCard: (state: BoardState, { payload }: PayloadAction<Card>) => {
      state.items[payload.board_id].cards!.items[payload.card_id] = payload
      state.items[payload.board_id].cards!.ids = Object.keys(state.items[payload.board_id].cards!.items).sort(
        (a, b) =>
          state.items[payload.board_id].cards!.items[a].position -
          state.items[payload.board_id].cards!.items[b].position
      )
    },
    newBoard: (state: BoardState, {}: PayloadAction<DraftBoard>) => init(state, BoardStateStatus.NewBoard),
    openNewBoard: (state: BoardState) => {
      state.newBoardIsOpen = true
    },
    closeNewBoard: (state: BoardState) => {
      state.newBoardIsOpen = false
    },
    newCategory: (state: BoardState, {}: PayloadAction<DraftCategory>) => init(state, BoardStateStatus.NewCategory),
    newCard: (state: BoardState, {}: PayloadAction<DraftCard>) => init(state, BoardStateStatus.NewCard),
    newTag: (state: BoardState, {}: PayloadAction<DraftTag>) => init(state, BoardStateStatus.NewTag),
  },
})

export const {
  success,
  failed,
  clear,
  loadBoards,
  loadBoard,
  setBoards,
  setBoard,
  setTags,
  setTag,
  setCategories,
  setCategory,
  setCards,
  setCard,
  newBoard,
  openNewBoard,
  closeNewBoard,
  newCategory,
  newCard,
  newTag,
} = boardSlice.actions
export default boardSlice.reducer
