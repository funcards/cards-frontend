import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { SignIn, Tokens } from './auth.types'

import { clearAuth, loginSuccess, setTokens } from './auth.slice'
import { addError } from '~src/modules/notification/notification.slice'

import { login } from './auth.api'

function* fetchTokens(service: any, payload: SignIn) {
  const tokens: Tokens = yield call(service, payload)
  yield put(setTokens(tokens))
}

function* authWorker(service: any, payload: SignIn) {
  try {
    yield call(fetchTokens, service, payload)
    yield put(loginSuccess())
  } catch (error) {
    yield put(addError({ message: (error as Error).message }))
    yield put(clearAuth())
    // TODO: clear another states
  }
}

export function* loginWorker({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, login, payload)
}

export function* logoutWorker() {
  yield put(clearAuth())
  // TODO: clear another states
}
