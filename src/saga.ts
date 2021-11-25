import { all, takeLatest } from 'redux-saga/effects'

import { signIn, signUp, signOut } from '~src/modules/auth/auth.slice'
import { signInWorker, signUpWorker, signOutWorker } from '~src/modules/auth/auth.saga'

function* saga() {
  yield all([
    takeLatest(signIn.type, signInWorker),
    takeLatest(signUp.type, signUpWorker),
    takeLatest(signOut.type, signOutWorker),
  ])
}

export default saga
