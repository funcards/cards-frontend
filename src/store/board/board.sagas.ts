import { call, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { caughtSaga, successSaga } from '../notification/notification.sagas'
import { closeAddBoard } from '../ui/ui.slice'

import {
  failedBoard,
  setBoards,
  successBoard,
  setBoard,
  setCategory,
  setTags,
  setCategories,
  setCards,
  setTag,
  setCard,
  setCategoriesPosition,
  setCardsPosition,
} from './board.slice'
import { selectBoard, selectCards, selectCategories } from './board.selectors'
import {
  Board,
  Category,
  Card,
  ChangeCardsPosition,
  ChangeCategoriesPosition,
  DraftBoard,
  DraftCard,
  DraftCategory,
  DraftTag,
} from './board.types'

import { fetcher } from '~src/utils/helpers'

export function* loadBoardsSaga() {
  try {
    const { data } = yield call(fetcher.get, '/boards')
    yield put(setBoards(data.data))
    yield put(successBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* loadBoardSaga({ payload }: PayloadAction<string>) {
  try {
    let board: Board | undefined = yield select(selectBoard, payload)

    if (!board) {
      const { data } = yield call(fetcher.get, `/boards/${payload}`)
      board = data
      yield put(setBoard(data))
    }

    if (board?.tags === undefined) {
      const { data } = yield call(fetcher.get, `/boards/${payload}/tags`)
      yield put(setTags({ board_id: payload, items: data.data }))
    }

    if (board?.categories === undefined) {
      const { data } = yield call(fetcher.get, `/boards/${payload}/categories`)
      yield put(setCategories({ board_id: payload, items: data.data }))
    }

    if (board?.cards === undefined) {
      const cards = []
      let count = 0

      do {
        const { data } = yield call(fetcher.get, `/boards/${payload}/cards`)
        count = data.count
        cards.push(...data.data)
      } while (cards.length < count)

      yield put(setCards({ board_id: payload, items: cards }))
    }

    yield put(successBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* newBoardSaga({ payload }: PayloadAction<DraftBoard>) {
  try {
    const { headers } = yield call(fetcher.post, '/boards', payload)
    const boardId = headers['location'].split('/').pop()
    yield call(loadBoardSaga, { payload: boardId } as PayloadAction<string>)
    yield call(successSaga, { payload: `Board "${payload.name}" added successfully.` } as PayloadAction<string>)
    yield put(closeAddBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* newCategorySaga({ payload }: PayloadAction<DraftCategory>) {
  const boardId = payload.board_id
  const { name, position } = payload

  try {
    const { headers } = yield call(fetcher.post, `/boards/${boardId}/categories`, { name, position })
    const categoryId = headers['location'].split('/').pop()
    const { data } = yield call(fetcher.get, `/boards/${boardId}/categories/${categoryId}`)

    yield put(setCategory(data))
    yield put(successBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* newTagSaga({ payload }: PayloadAction<DraftTag>) {
  const boardId = payload.board_id
  const { name, color } = payload

  try {
    const { headers } = yield call(fetcher.post, `/boards/${boardId}/tags`, { name, color })
    const tagId = headers['location'].split('/').pop()
    const { data } = yield call(fetcher.get, `/boards/${boardId}/tags/${tagId}`)

    yield put(setTag(data))
    yield put(successBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* newCardSaga({ payload }: PayloadAction<DraftCard>) {
  const boardId = payload.board_id
  const { category_id, name, position } = payload

  try {
    const { headers } = yield call(fetcher.post, `/boards/${boardId}/cards`, { category_id, name, position })
    const cardId = headers['location'].split('/').pop()
    const { data } = yield call(fetcher.get, `/boards/${boardId}/cards/${cardId}`)

    yield put(setCard(data))
    yield put(successBoard())
  } catch (e) {
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* changeCategoriesPositionSaga({ payload }: PayloadAction<ChangeCategoriesPosition>) {
  yield put(setCategoriesPosition(payload))

  try {
    const categories: Category[] = yield select(selectCategories, payload.board_id)
    const data = categories.map((c) => ({ category_id: c.category_id, position: c.position }))
    yield call(fetcher.patch, `/boards/${payload.board_id}/categories`, data)
    yield put(successBoard())
  } catch (e) {
    yield put(
      setCategoriesPosition({ board_id: payload.board_id, source: payload.destination, destination: payload.source })
    )
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* changeCardsPositionSaga({ payload }: PayloadAction<ChangeCardsPosition>) {
  yield put(setCardsPosition(payload))

  try {
    const cards: Card[] = yield select(selectCards, payload.board_id)
    const data = cards.map((c, index) => {
      if (payload.destination.index === index && payload.source.category_id !== payload.destination.category_id) {
        return { card_id: c.card_id, category_id: payload.destination.category_id, position: c.position }
      }

      return { card_id: c.card_id, position: c.position }
    })
    yield call(fetcher.patch, `/boards/${payload.board_id}/cards`, data)
    yield put(successBoard())
  } catch (e) {
    yield put(
      setCardsPosition({ board_id: payload.board_id, source: payload.destination, destination: payload.source })
    )
    yield call(caughtSaga, e, failedBoard)
  }
}
