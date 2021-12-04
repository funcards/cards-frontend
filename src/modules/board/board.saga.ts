import { call, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { closeNewBoard, failed, setBoards, success, upsertBoard } from './board.slice'

import { fetcher } from '~src/utils/fetcher'
import { selectBoard } from '~src/modules/board/board.selectors'
import { Board, DraftBoard } from '~src/modules/board/board.types'
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
      yield put(upsertBoard(data))
      board = data
    }

    // TODO: load members
    // TODO: load categories
    // TODO: load tags
    // TODO: load cards

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
