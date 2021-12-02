import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { authApi } from '~src/modules/auth/auth.api'
import { userApi } from '~src/modules/user/user.api'
import { boardApi } from '~src/modules/board/board.api'
import notification from '~src/modules/notification/notification.slice'
import auth from '~src/modules/auth/auth.slice'
import user from '~src/modules/user/user.slice'
import board from '~src/modules/board/board.slice'

import { isProduction } from '~src/utils/constants'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    notification,
    auth,
    user,
    board,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, boardApi.middleware),
  devTools: !isProduction,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
