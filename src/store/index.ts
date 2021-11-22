import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './rootReducer'

import { isProduction } from '~src/utils/constants'

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: !isProduction,
})
