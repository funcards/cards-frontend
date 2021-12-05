import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { all, takeLatest } from 'redux-saga/effects'

import notification from '~src/modules/notification/notification.slice'
import auth, { signIn, signOut, signUp } from '~src/modules/auth/auth.slice'
import board, {
  changeCardsPosition,
  changeCategoriesPosition,
  loadBoard,
  loadBoards,
  newBoard,
  newCard,
  newCategory,
  newTag,
} from '~src/modules/board/board.slice'
import { isProduction } from '~src/utils/constants'
import { signInSaga, signOutSaga, signUpSaga } from '~src/modules/auth/auth.saga'
import {
  changeCardsPositionSaga,
  changeCategoriesPositionSaga,
  loadBoardSaga,
  loadBoardsSaga,
  newBoardSaga,
  newCardSaga,
  newCategorySaga,
  newTagSaga,
} from '~src/modules/board/board.saga'

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
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
