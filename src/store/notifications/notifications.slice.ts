import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import { ErrorResponse, Notification, NotifyType } from '@/types';

export type NotificationsState = {
  notifications: Notification[];
};

const dismiss = 4000; // 4s

const reducer = (state: NotificationsState, { payload }: PayloadAction<Notification>) => {
  state.notifications.unshift(payload);
};

const prepare = (type: NotifyType) => (message: string) => {
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return { payload: { id: uuid(), title, type, dismiss, message } };
};

const initialState: NotificationsState = { notifications: [] };

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    info: { reducer, prepare: prepare(NotifyType.Info) },
    success: { reducer, prepare: prepare(NotifyType.Success) },
    warning: { reducer, prepare: prepare(NotifyType.Warning) },
    error: { reducer, prepare: prepare(NotifyType.Error) },
    caught: (state: NotificationsState, { payload }: PayloadAction<ErrorResponse>) => {
      state.notifications.unshift({ ...prepare(NotifyType.Error)(payload.message).payload, title: payload.title });
      // TODO: add validation errors
    },
    removeNotification: (state: NotificationsState, { payload }: PayloadAction<Notification | string>) => {
      const id = typeof payload === 'string' ? payload : payload.id;
      const index = state.notifications.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    },
    clearNotifications: () => initialState,
  },
});

export default slice.reducer;

export const { info, success, warning, error, caught, removeNotification, clearNotifications } = slice.actions;
