import { RootState } from './types'

export const getNotifications = (state: RootState) => state.notificationsState
export const getAuth = (state: RootState) => state.authState
