import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { userService } from '~src/services/User/User.service'
import { authService } from '~src/services/Auth/Auth.service'

import { SignIn, Tokens, User } from '~src/store/types'
import { clearAuth, loginSuccess, setCurrentUser, setTokens } from '~src/store/auth/auth.slice'
import { addError } from '~src/store/notifications/notifications.slice'

function* fetchTokens(service: any, payload: SignIn) {
  const tokens: Tokens = yield call(service, payload)
  yield put(setTokens(tokens))
}

function* fetchCurrentUser() {
  const currentUser: User = yield call(userService.me)
  yield put(setCurrentUser(currentUser))
}

function* authWorker(service: any, payload: SignIn) {
  try {
    yield call(fetchTokens, service, payload)
    yield call(fetchCurrentUser)
    yield put(loginSuccess())
  } catch (error) {
    yield put(addError({ message: (error as Error).message }))
    yield put(clearAuth())
  }
}

export function* loginWorker({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, authService.login, payload)
}

export function* logoutWorker() {
  yield put(clearAuth())
}
