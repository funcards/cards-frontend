import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User, UserState } from './user.types'
import { userApi } from './user.api'

export const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.user_id,
})

const userSlice = createSlice({
  name: 'users',
  initialState: userAdapter.getInitialState({
    currentUser: undefined
  }),
  reducers: {
    removeAll: (state: UserState) => {
      state.currentUser = undefined
      userAdapter.removeAll(state)
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.me.matchFulfilled, (state: UserState, { payload }: PayloadAction<User>) => {
        state.currentUser = payload
        userAdapter.upsertOne(state, payload)
      })
      .addMatcher(userApi.endpoints.getUsers.matchFulfilled, (state: UserState, { payload }: PayloadAction<User[]>) => {
        userAdapter.upsertMany(state, payload)
      })
  }
})

export const { removeAll } = userSlice.actions
export default userSlice.reducer
