import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { swap } from '~src/utils/helpers'

import { ErrorResponse } from '../types'

import {
  Board,
  BoardItems,
  BoardState,
  BoardStateStatus,
  Card,
  Category,
  ChangeCardsPosition,
  ChangeCategoriesPosition,
  DraftBoard,
  DraftCard,
  DraftCategory,
  DraftTag,
  Tag,
} from './board.types'
import { isCard, safeBoardApplyFn, sortFn } from './board.helpers'

const initialState: BoardState = {
  boards: [],
  loadedAll: false,
  isLoading: false,
  isError: false,
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
    successBoard: (state: BoardState) => end(state, BoardStateStatus.Success),
    failedBoard: (state: BoardState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isLoading = false
      state.isError = true
      state.error = payload
      state.status = BoardStateStatus.Error
    },
    clearBoard: () => initialState,
    loadBoards: (state: BoardState) => init(state, BoardStateStatus.LoadBoardList),
    loadBoard: (state: BoardState, {}: PayloadAction<string>) => init(state, BoardStateStatus.LoadOneBoard),
    setBoards: (state: BoardState, { payload }: PayloadAction<Board[]>) => {
      state.loadedAll = true
      state.boards = payload.sort(sortFn).reverse()
    },
    setBoard: (state: BoardState, { payload }: PayloadAction<Board>) => {
      state.boards = [...state.boards.filter((b) => b.board_id !== payload.board_id), payload].sort(sortFn).reverse()
    },
    setTags: (state: BoardState, { payload }: PayloadAction<BoardItems<Tag>>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        board.tags = payload.items
      })
    },
    setTag: (state: BoardState, { payload }: PayloadAction<Tag>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        const tags = board.tags?.filter((t) => t.tag_id !== payload.tag_id)
        tags?.push(payload)
        board.tags = tags
      })
    },
    setCategories: (state: BoardState, { payload }: PayloadAction<BoardItems<Category>>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        board.categories = payload.items.sort(sortFn)
      })
    },
    setCategory: (state: BoardState, { payload }: PayloadAction<Category>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        const categories = board.categories?.filter((c) => c.category_id !== payload.category_id)
        categories?.push(payload)
        board.categories = categories?.sort(sortFn)
      })
    },
    setCards: (state: BoardState, { payload }: PayloadAction<BoardItems<Card>>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        board.cards = payload.items.filter(isCard).sort(sortFn)
      })
    },
    setCard: (state: BoardState, { payload }: PayloadAction<Card>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        const cards = board.cards?.filter((c) => isCard(c) && c.card_id !== payload.card_id)
        cards?.push(payload)
        board.cards = cards?.sort(sortFn)
      })
    },
    appendDraftCard: (state: BoardState, { payload }: PayloadAction<string>) => {
      safeBoardApplyFn(state, payload, (board) => {
        if (!board.cards) {
          board.cards = []
        }

        board.cards = board.cards!.filter(isCard)

        const positions: Record<string, number> = {}

        for (const c of board.cards!) {
          positions[c.category_id] = Math.max(c.position, positions[c.category_id] ?? 0)
        }

        for (const c of board.categories ?? []) {
          board.cards!.push({
            board_id: board.board_id,
            category_id: c.category_id,
            name: '',
            position: (positions[c.category_id] ?? -1) + 1,
            tags: [],
          })
        }
      })
    },
    prependDraftCard: (state: BoardState, { payload }: PayloadAction<{ board_id: string; category_id: string }>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        const position = Math.min(
          ...(board.cards
            ?.filter((c) => isCard(c) && c.category_id === payload.category_id)
            ?.map((c) => c.position) ?? [0, 0])
        )
        const index = board.cards?.findIndex((c) => !isCard(c) && c.category_id === payload.category_id) ?? -1
        if (index > -1) {
          const item = board.cards!.splice(index, 1)
          item[0].position = position - 1
          board.cards!.splice(0, 0, item[0])
        }
      })
    },
    newBoard: (state: BoardState, {}: PayloadAction<DraftBoard>) => init(state, BoardStateStatus.NewBoard),
    newCategory: (state: BoardState, {}: PayloadAction<DraftCategory>) => init(state, BoardStateStatus.NewCategory),
    newCard: (state: BoardState, {}: PayloadAction<DraftCard>) => init(state, BoardStateStatus.NewCard),
    newTag: (state: BoardState, {}: PayloadAction<DraftTag>) => init(state, BoardStateStatus.NewTag),
    changeCategoriesPosition: (state: BoardState, {}: PayloadAction<ChangeCategoriesPosition>) =>
      init(state, BoardStateStatus.ChangeCategoryPosition),
    changeCardsPosition: (state: BoardState, {}: PayloadAction<ChangeCardsPosition>) =>
      init(state, BoardStateStatus.ChangeCardPosition),
    setCategoriesPosition: (state: BoardState, { payload }: PayloadAction<ChangeCategoriesPosition>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        if (board.categories) {
          board.categories = swap(board.categories, payload.source, payload.destination).map((c, i) => ({
            ...c,
            position: i,
          }))
        }
      })
    },
    setCardsPosition: (state: BoardState, { payload }: PayloadAction<ChangeCardsPosition>) => {
      safeBoardApplyFn(state, payload.board_id, (board) => {
        if (board.cards) {
          board.cards = swap(board.cards.filter(isCard), payload.source.index, payload.destination.index).map(
            (c, i) => ({
              ...c,
              position: i,
            })
          )
          board.cards[payload.destination.index].category_id = payload.destination.category_id
        }
      })
    },
    editBoard: (state: BoardState, {}: PayloadAction<Partial<Board>>) => init(state, BoardStateStatus.EditBoard),
    editCategory: (state: BoardState, {}: PayloadAction<Partial<Category>>) =>
      init(state, BoardStateStatus.EditCategory),
    editCard: (state: BoardState, {}: PayloadAction<Partial<Card>>) => init(state, BoardStateStatus.EditCard),
  },
})

export const {
  successBoard,
  failedBoard,
  clearBoard,
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
  appendDraftCard,
  prependDraftCard,
  newBoard,
  newCategory,
  newCard,
  newTag,
  changeCategoriesPosition,
  changeCardsPosition,
  setCategoriesPosition,
  setCardsPosition,
  editBoard,
  editCategory,
  editCard,
} = boardSlice.actions
export default boardSlice.reducer
