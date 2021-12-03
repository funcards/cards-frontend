import { Action } from 'redux'
import { put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { addCaught, addSuccess } from './notification.slice'

import { toErrorResponse } from '~src/utils/fetcher'
import { ErrorResponse } from '~src/modules/common/common.types'

type Reducer<A extends Action> = (e: ErrorResponse) => A

export function* caughtSaga<A extends Action>(e: any, reducer?: Reducer<A>) {
  const error = toErrorResponse(e)
  yield put(addCaught(error))

  if (reducer) {
    yield put(reducer(error))
  }
}

export function* successSaga({ payload }: PayloadAction<string>) {
  yield put(addSuccess({ message: payload }))
}
