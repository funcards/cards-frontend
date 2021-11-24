import { all, takeLatest } from 'redux-saga/effects'

import { login, logout } from '~src/modules/auth/auth.slice'
import { loginWorker, logoutWorker } from '~src/modules/auth/auth.saga'

function* saga() {
  yield all([takeLatest(login.type, loginWorker), takeLatest(logout.type, logoutWorker)])
}

export default saga
