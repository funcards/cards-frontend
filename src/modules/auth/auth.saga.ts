import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { SignIn, Tokens } from './auth.types'

import { clearAuth, signInSuccess, setTokens } from './auth.slice'
import { addError } from '~src/modules/notification/notification.slice'

import { signIn, signUp } from './auth.api'

function* fetchTokens(service: any, payload: SignIn) {
  const tokens: Tokens = yield call(service, payload)
  yield put(setTokens(tokens))
}

function* authWorker(service: any, payload: SignIn) {
  try {
    yield call(fetchTokens, service, payload)
    yield put(signInSuccess())
  } catch (error) {
    yield put(addError({ message: (error as Error).message }))
    yield put(clearAuth())
    // TODO: clear another states
  }
}

export function* signInWorker({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, signIn, payload)
}

export function* signUpWorker({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, signUp, payload)
}

export function* signOutWorker() {
  yield put(clearAuth())
  // TODO: clear another states
}
