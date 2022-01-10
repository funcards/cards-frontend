import { call, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { fetcher, noUndefined } from '~src/utils/helpers'

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
      // const { data } = yield call(fetcher.get, `/boards/${payload}/tags`)
      // yield put(setTags({ board_id: payload, items: data.data }))
      // TODO: remove
      const data = [
        { tag_id: '1', board_id: payload, name: 'SF', color: 'sky' },
        { tag_id: '2', board_id: payload, name: 'Fantasy', color: 'orange' },
        { tag_id: '3', board_id: payload, name: 'Psihologie', color: 'red' },
        { tag_id: '4', board_id: payload, name: 'Pupkin', color: 'no-color' },
      ]
      yield put(setTags({ board_id: payload, items: data }))
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

      // TODO: remove
      yield put(setCards({ board_id: payload, items: cards.map((c) => ({ ...c, tags: ['1', '2', '3', '4'] })) }))
      // yield put(setCards({ board_id: payload, items: cards }))
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

export function* editBoardSaga({ payload }: PayloadAction<Partial<Board>>) {
  const { board_id, ...rest } = noUndefined(payload)

  if (!board_id) {
    return
  }

  const board: Board | undefined = yield select(selectBoard, board_id)

  if (!board) {
    return
  }

  const oldBoard = JSON.parse(JSON.stringify(board))

  try {
    yield put(setBoard({ ...board, ...rest }))
    yield call(fetcher.patch, `/boards/${board_id}`, rest)
    yield put(successBoard())
  } catch (e) {
    yield put(setBoard(oldBoard))
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* editCategorySaga({ payload }: PayloadAction<Partial<Category>>) {
  const { board_id, category_id, ...rest } = noUndefined(payload)

  if (!board_id || !category_id) {
    return
  }

  const board: Board | undefined = yield select(selectBoard, board_id)

  if (!board) {
    return
  }

  const category = board.categories?.find((c) => c.category_id === category_id)

  if (!category) {
    return
  }

  const oldCategory = JSON.parse(JSON.stringify(category))

  try {
    yield put(setCategory({ ...category, ...rest }))
    yield call(fetcher.patch, `/boards/${board_id}/categories/${category_id}`, rest)
    yield put(successBoard())
  } catch (e) {
    yield put(setCategory(oldCategory))
    yield call(caughtSaga, e, failedBoard)
  }
}

export function* editCardSaga({ payload }: PayloadAction<Partial<Card>>) {
  const { board_id, card_id, ...rest } = noUndefined(payload)

  if (!board_id || !card_id) {
    return
  }

  const board: Board | undefined = yield select(selectBoard, board_id)

  if (!board) {
    return
  }

  const card = board.cards?.find((c) => c.card_id === card_id)

  if (!card) {
    return
  }

  const oldCard = JSON.parse(JSON.stringify(card))

  try {
    yield put(setCard({ ...card, ...rest }))
    yield call(fetcher.patch, `/boards/${board_id}/cards/${card_id}`, rest)
    yield put(successBoard())
  } catch (e) {
    yield put(setCard(oldCard))
    yield call(caughtSaga, e, failedBoard)
  }
}
