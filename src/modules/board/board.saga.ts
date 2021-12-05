import { call, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import {
  closeNewBoard,
  failed,
  setBoards,
  success,
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

import { fetcher } from '~src/utils/fetcher'
import { selectBoard, selectCards, selectCategories } from '~src/modules/board/board.selectors'
import {
  Board, Card,
  Category,
  ChangeCardsPosition,
  ChangeCategoriesPosition,
  Collection,
  DraftBoard,
  DraftCard,
  DraftCategory,
  DraftTag,
} from '~src/modules/board/board.types'
import { caughtSaga, successSaga } from '~src/modules/notification/notification.saga'

export function* loadBoardsSaga() {
  try {
    const { data } = yield call(fetcher.get, '/boards')
    yield put(setBoards(data.data))
    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
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

    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
  }
}

export function* newBoardSaga({ payload }: PayloadAction<DraftBoard>) {
  try {
    const { headers } = yield call(fetcher.post, '/boards', payload)
    const boardId = headers['location'].split('/').pop()
    yield call(loadBoardSaga, { payload: boardId } as PayloadAction<string>)
    yield call(successSaga, { payload: `Board "${payload.name}" added successfully.` } as PayloadAction<string>)
    yield put(closeNewBoard())
  } catch (e) {
    yield call(caughtSaga, e, failed)
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
    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
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
    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
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
    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
  }
}

export function* changeCategoriesPositionSaga({ payload }: PayloadAction<ChangeCategoriesPosition>) {
  const categories: Collection<Category> = yield select(selectCategories, payload.board_id)
  const oldIds = categories.ids.slice()

  try {
    yield put(setCategoriesPosition(payload))
    yield put(success())
  } catch (e) {
    yield put(setCategoriesPosition({ ...payload, ids: oldIds }))
    yield call(caughtSaga, e, failed)
  }
}

export function* changeCardsPositionSaga({ payload }: PayloadAction<ChangeCardsPosition>) {
  const cards: Collection<Card> = yield select(selectCards, payload.board_id)
  const oldIds = cards.ids.slice()

  try {
    yield put(setCardsPosition(payload))
    yield put(success())
  } catch (e) {
    yield put(setCardsPosition({ ...payload, ids: oldIds }))
    yield call(caughtSaga, e, failed)
  }
}
