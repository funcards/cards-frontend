import { Action } from 'redux'
import { put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { ErrorResponse } from '../types'

import { addCaught, addSuccess } from './notification.slice'

const toErrorResponse = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response?.data as ErrorResponse
  }

  return { status: 500, type: 'ClientError', title: 'Error', message: (error as Error).message }
}

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
