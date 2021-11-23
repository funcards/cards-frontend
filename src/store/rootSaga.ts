import { all, takeLatest } from 'redux-saga/effects'

import { login, logout } from '~src/store/auth/auth.slice'
import { loginWorker, logoutWorker } from '~src/store/auth/auth.saga'

function* rootSaga() {
  yield all([takeLatest(login.type, loginWorker), takeLatest(logout.type, logoutWorker)])
}

export default rootSaga
