import { takeLatest, call, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { SignIn, SignUp, Tokens, User } from '@/types';
import {
  clearAuth,
  clearBoards,
  clearNotifications,
  fulfilledAuth,
  pendingAuth,
  rejectedAuth,
  setCurrentUser,
  setTokens,
  clearCategories,
  clearTags,
  clearCards,
  clearUi,
  SIGN_IN,
  SIGN_UP,
  SIGN_OUT,
} from '@/store';
import { AuthApi, UsersApi } from '@/services';
import { caughtWorker } from '@/store/notifications/notifications.saga';

function* authWorker(service: () => Promise<Tokens>) {
  try {
    yield put(pendingAuth());

    const tokens: Tokens = yield call(service);
    yield put(setTokens(tokens));

    const user: User = yield call(UsersApi.me);
    yield put(setCurrentUser(user));

    yield put(fulfilledAuth());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedAuth());
  }
}

function* signInWorker({ payload }: PayloadAction<SignIn>) {
  yield call(authWorker, () => AuthApi.signIn(payload));
}

function* signUpWorker({ payload }: PayloadAction<SignUp>) {
  yield call(authWorker, () => AuthApi.signUp(payload));
}

function* signOutWorker() {
  yield put(clearUi());
  yield put(clearNotifications());
  yield put(clearBoards());
  yield put(clearCategories());
  yield put(clearTags());
  yield put(clearCards());
  yield put(clearAuth());
}

export function* authWatcher() {
  yield takeLatest(SIGN_IN, signInWorker);
  yield takeLatest(SIGN_UP, signUpWorker);
  yield takeLatest(SIGN_OUT, signOutWorker);
}
