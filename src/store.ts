import { configureStore } from '@reduxjs/toolkit'

import { AuthState } from '~src/modules/auth/auth.types'
import { NotificationState } from '~src/modules/notification/notification.types'

import { authApi } from '~src/modules/auth/auth.api'
import authReducer from '~src/modules/auth/auth.slice'
import notificationReducer from '~src/modules/notification/notification.slice'

import { isProduction } from '~src/utils/constants'

export interface RootState {
  auth: AuthState
  notification: NotificationState
}

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
  devTools: !isProduction,
})
