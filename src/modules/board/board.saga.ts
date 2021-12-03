import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { failed, setBoards, success, upsertBoard } from './board.slice'

import { fetcher, toErrorResponse } from '~src/utils/fetcher'
import { addCaught } from '~src/modules/notification/notification.slice'

export function* loadBoardsSaga() {
  try {
    const { data } = yield call(fetcher.get, '/boards')
    yield put(setBoards(data.data))
    yield put(success())
  } catch (e) {
    const error = toErrorResponse(e)
    yield put(addCaught(error))
    yield put(failed(error))
  }
}

export function* loadBoardSaga({ payload }: PayloadAction<string>) {
  try {
    const { data } = yield call(fetcher.get, `/boards/${payload}`)
    yield put(upsertBoard(data))

    // TODO: load members
    // TODO: load categories
    // TODO: load tags
    // TODO: load cards

    yield put(success())
  } catch (e) {
    const error = toErrorResponse(e)
    yield put(addCaught(error))
    yield put(failed(error))
  }
}
