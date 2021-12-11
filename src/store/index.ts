import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { all, takeLatest } from 'redux-saga/effects'

import ui from './ui/ui.slice'
import notification from './notification/notification.slice'
import auth, { signIn, signOut, signUp } from './auth/auth.slice'
import board, {
  changeCardsPosition,
  changeCategoriesPosition,
  loadBoard,
  loadBoards,
  newBoard,
  newCard,
  newCategory,
  newTag,
} from './board/board.slice'
import { signInSaga, signOutSaga, signUpSaga } from './auth/auth.sagas'
import {
  changeCardsPositionSaga,
  changeCategoriesPositionSaga,
  loadBoardSaga,
  loadBoardsSaga,
  newBoardSaga,
  newCardSaga,
  newCategorySaga,
  newTagSaga,
} from './board/board.sagas'

import { isProduction } from '~src/utils/constants'

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    ui,
    notification,
    auth,
    board,
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
    takeLatest(signOut.type, signOutSaga),
    takeLatest(loadBoards.type, loadBoardsSaga),
    takeLatest(loadBoard.type, loadBoardSaga),
    takeLatest(newBoard.type, newBoardSaga),
    takeLatest(newCategory.type, newCategorySaga),
    takeLatest(newTag.type, newTagSaga),
    takeLatest(newCard.type, newCardSaga),
    takeLatest(changeCategoriesPosition.type, changeCategoriesPositionSaga),
    takeLatest(changeCardsPosition.type, changeCardsPositionSaga),
  ])
}

sagaMiddleware.run(rootSaga)
