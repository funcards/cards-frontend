import { combineReducers, Reducer } from 'redux'

import authReducer from './auth/auth.slice'
import notificationsReducer from './notifications/notifications.slice'
import { RootState } from './types'

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  authState: authReducer,
  notificationsState: notificationsReducer,
})

export default rootReducer
