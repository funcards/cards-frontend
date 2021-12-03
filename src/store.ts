import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { all, takeLatest } from 'redux-saga/effects'

import notification from '~src/modules/notification/notification.slice'
import auth, { signIn, signUp } from '~src/modules/auth/auth.slice'
import board, { loadBoard, loadBoards, newBoard } from '~src/modules/board/board.slice'
import user from '~src/modules/user/user.slice'
import { isProduction } from '~src/utils/constants'
import { signInSaga, signUpSaga } from '~src/modules/auth/auth.saga'
import { loadBoardSaga, loadBoardsSaga, newBoardSaga } from '~src/modules/board/board.saga'

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    notification,
    auth,
    board,
    user,
  },
  middleware: (getDefaultMiddleware) => [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: !isProduction,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

function* rootSaga() {
  yield all([
    takeLatest(signIn.type, signInSaga),
    takeLatest(signUp.type, signUpSaga),
    takeLatest(loadBoards.type, loadBoardsSaga),
    takeLatest(loadBoard.type, loadBoardSaga),
    takeLatest(newBoard.type, newBoardSaga),
  ])
}

sagaMiddleware.run(rootSaga)
