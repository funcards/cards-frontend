import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User, UserState } from './user.types'

import { ErrorResponse } from '~src/modules/common/common.types'

export const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.user_id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const initialState: UserState = userAdapter.getInitialState({
  isLoading: false,
  isError: false,
})

// url: `users?${querystring.stringify({ users: ids }, { arrayFormat: 'bracket' })}`,

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    success: (state: UserState) => {
      state.isLoading = false
      state.isError = false
      state.error = undefined
    },
    failed: (state: UserState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isLoading = false
      state.isError = true
      state.error = payload
    },
    clear: (state: UserState) => {
      state.isLoading = false
      state.isError = false
      state.error = undefined
      userAdapter.removeAll(state)
    },
    setUsers: (state: UserState, { payload }: PayloadAction<User[]>) => {
      userAdapter.setAll(state, payload)
    },
    addUser: (state: UserState, { payload }: PayloadAction<User>) => {
      userAdapter.upsertOne(state, payload)
    },
  },
})

export const { success, failed, clear, setUsers, addUser } = userSlice.actions
export default userSlice.reducer
