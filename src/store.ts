import { combineReducers, Reducer } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'

import { AuthState } from '~src/modules/auth/auth.types'
import { NotificationState } from '~src/modules/notification/notification.types'

import authReducer from '~src/modules/auth/auth.slice'
import notificationReducer from '~src/modules/notification/notification.slice'

import { isProduction } from '~src/utils/constants'

export interface RootState {
  authState: AuthState
  notificationState: NotificationState
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  authState: authReducer,
  notificationState: notificationReducer,
})

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: !isProduction,
})
