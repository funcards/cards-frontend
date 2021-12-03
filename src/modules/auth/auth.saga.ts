import { call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { SignIn, SignUp } from './auth.types'
import { failed, setCurrentUser, setTokens, success } from './auth.slice'

import { fetcher } from '~src/utils/fetcher'
import { caughtSaga } from '~src/modules/notification/notification.saga'

const config: AxiosAuthRefreshRequestConfig = { skipAuthRefresh: true }

function* authWorker(url: string, payload: SignIn | SignUp) {
  try {
    const { data: tokens } = yield call(fetcher.post, url, payload, config)
    yield put(setTokens(tokens))

    const { data: currentUser } = yield call(fetcher.get, '/users/me')
    yield put(setCurrentUser(currentUser))

    yield put(success())
  } catch (e) {
    yield call(caughtSaga, e, failed)
  }
}

export function* signInSaga({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, '/sign-in', payload)
}

export function* signUpSaga({ payload }: PayloadAction<SignUp>) {
  yield call(authWorker, '/sign-up', payload)
}
