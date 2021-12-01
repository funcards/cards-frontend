import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import * as storage from '~src/storage/cookies.storage'

import { AuthState, Tokens } from './auth.types'
import { authApi } from './auth.api'

const keyTokens = 'tokens'
const tokens = storage.get(keyTokens, undefined)
const isAuthenticated = tokens !== undefined && Object.keys(tokens).length > 0

const initialState: AuthState = {
  isAuthenticated,
  tokens: isAuthenticated ? tokens : undefined,
}

const signInReducer = (state: AuthState, { payload }: PayloadAction<Tokens>) => {
  state.isAuthenticated = true
  state.tokens = payload
  storage.set(keyTokens, payload)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state: AuthState) => {
      state.isAuthenticated = false
      state.tokens = undefined
      storage.remove(keyTokens)
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, signInReducer)
      .addMatcher(authApi.endpoints.signUp.matchFulfilled, signInReducer)
  },
})

export const { signOut } = authSlice.actions
export default authSlice.reducer
