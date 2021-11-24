import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import { NotificationState, NotifyType, Notification } from './notification.types'

const dismiss = 4000 // 4s

const normalize = (notification: Notification): Notification => {
  const type = notification.type || NotifyType.Info
  const title = type.charAt(0).toUpperCase() + type.slice(1)

  return { id: uuid(), title, type, dismiss, ...notification }
}

const initialState: NotificationState = {
  notifications: [], // { id, title, type: NotifyType, dismiss: < 1 for infinite, message }
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state: NotificationState, { payload }: PayloadAction<Notification>) => {
      state.notifications.unshift(normalize(payload))
    },
    addSuccess: (state: NotificationState, { payload }: PayloadAction<Notification>) => {
      state.notifications.unshift(normalize({ type: NotifyType.Success, ...payload }))
    },
    addWarning: (state: NotificationState, { payload }: PayloadAction<Notification>) => {
      state.notifications.unshift(normalize({ type: NotifyType.Warning, ...payload }))
    },
    addError: (state: NotificationState, { payload }: PayloadAction<Notification>) => {
      state.notifications.unshift(normalize({ type: NotifyType.Error, ...payload }))
    },
    removeNotification: (state: NotificationState, { payload }: PayloadAction<Notification | string>) => {
      const id = typeof payload === 'string' ? payload : payload.id
      const index = state.notifications.findIndex((item) => item.id === id)
      if (index !== -1) {
        state.notifications.splice(index, 1)
      }
    },
    clearNotifications: (state: NotificationState) => {
      state.notifications = []
    },
  },
})

export const { addNotification, addSuccess, addWarning, addError, removeNotification, clearNotifications } =
  notificationSlice.actions

export default notificationSlice.reducer
