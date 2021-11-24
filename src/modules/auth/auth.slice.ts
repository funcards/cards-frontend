import { createSlice, PayloadAction } from '~node_modules/@reduxjs/toolkit'

import * as storage from '~src/storage/cookies.storage'

import { AuthState, SignIn, Tokens } from './auth.types'

const keyTokens = 'tokens'
const tokens = storage.get(keyTokens, undefined)
const isAuthenticated = tokens !== undefined

const initialState: AuthState = {
  isAuthenticated,
  tokens: isAuthenticated ? tokens : undefined,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState, { payload }: PayloadAction<SignIn>) => {
      state.loading = true
    },
    loginSuccess: (state: AuthState) => {
      state.isAuthenticated = true
      state.loading = false
    },
    logout: (state: AuthState) => {
      state.loading = true
    },
    setTokens: (state: AuthState, { payload }: PayloadAction<Tokens>) => {
      state.tokens = payload
      storage.set(keyTokens, payload)
    },
    clearAuth: (state: AuthState) => {
      state.isAuthenticated = false
      state.tokens = undefined
      state.loading = false
      storage.remove(keyTokens)
    },
  },
})

export const { login, loginSuccess, logout, setTokens, clearAuth } = authSlice.actions

export default authSlice.reducer
