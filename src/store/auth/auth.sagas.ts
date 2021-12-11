import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { caughtSaga } from '../notification/notification.sagas'
import { clearBoard } from '../board/board.slice'
import { clearUi } from '../ui/ui.slice'

import { SignIn, SignUp } from './auth.types'
import { setCurrentUser, setTokens, successAuth, failedAuth } from './auth.slice'

import { fetcher } from '~src/utils/helpers'

const config: AxiosAuthRefreshRequestConfig = { skipAuthRefresh: true }

function* authWorker(url: string, payload: SignIn | SignUp) {
  try {
    const { data: tokens } = yield call(fetcher.post, url, payload, config)
    yield put(setTokens(tokens))

    const { data: currentUser } = yield call(fetcher.get, '/users/me')
    yield put(setCurrentUser(currentUser))

    yield put(successAuth())
  } catch (e) {
    yield call(caughtSaga, e, failedAuth)
  }
}

export function* signInSaga({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, '/sign-in', payload)
}

export function* signUpSaga({ payload }: PayloadAction<SignUp>) {
  yield call(authWorker, '/sign-up', payload)
}

export function* signOutSaga() {
  yield put(clearBoard())
  yield put(clearUi())
}
