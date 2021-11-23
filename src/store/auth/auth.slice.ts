import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AuthState, User, SignIn, Tokens } from '~src/store/types'
import { localStorageService } from '~src/services/LocalStorage/LocalStorage.service'
import { cookiesService } from '~src/services/Cookies/Cookies.service'

const keyUser = 'auth.user'
const keyTokens = 'tokens'

const currentUser = localStorageService.get(keyUser, undefined)
const tokens = cookiesService.get(keyTokens, undefined)
const isAuthenticated = currentUser !== undefined && tokens !== undefined

const initialState: AuthState = {
  isAuthenticated,
  currentUser: isAuthenticated ? currentUser : undefined,
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
    setCurrentUser: (state: AuthState, { payload }: PayloadAction<User>) => {
      state.currentUser = payload
      localStorageService.set(keyUser, payload)
    },
    setTokens: (state: AuthState, { payload }: PayloadAction<Tokens>) => {
      state.tokens = payload
      cookiesService.set(keyTokens, payload)
    },
    clearAuth: (state: AuthState) => {
      state.isAuthenticated = false
      state.currentUser = undefined
      state.tokens = undefined
      state.loading = false
      localStorageService.remove(keyUser)
      cookiesService.remove(keyTokens)
    },
  },
})

export const { login, loginSuccess, logout, setCurrentUser, setTokens, clearAuth } = authSlice.actions

export default authSlice.reducer
