import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AuthState, SignIn, SignUp, CurrentUser, Tokens } from './auth.types'

import * as cookiesStorage from '~src/storage/cookies.storage'
import * as localStorage from '~src/storage/local.storage'
import { ErrorResponse } from '~src/modules/common/common.types'

const keyTokens = 'tokens'
const keyCurrentUser = 'current.user'
const tokens = cookiesStorage.get<Tokens | undefined>(keyTokens, undefined)
const currentUser = localStorage.get<CurrentUser | undefined>(keyCurrentUser, undefined)
const isAuthenticated = tokens !== undefined && currentUser !== undefined

const initialState: AuthState = {
  isAuthenticated,
  isLoading: false,
  isError: false,
  tokens,
  currentUser,
}

const init = (state: AuthState, {}: PayloadAction<SignIn | SignUp>) => {
  state.isAuthenticated = false
  state.isLoading = true
  state.isError = false
  state.error = undefined
  state.tokens = undefined
  state.currentUser = undefined
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: init,
    signUp: init,
    signOut: (state: AuthState) => {
      state.isAuthenticated = false
      state.isLoading = false
      state.isError = false
      state.error = undefined
      state.tokens = undefined
      state.currentUser = undefined
      cookiesStorage.remove(keyTokens)
      localStorage.remove(keyCurrentUser)
    },
    success: (state: AuthState) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.isError = false
      state.error = undefined
    },
    failed: (state: AuthState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isAuthenticated = false
      state.isLoading = false
      state.isError = true
      state.error = payload
      state.tokens = undefined
      state.currentUser = undefined
      cookiesStorage.remove(keyTokens)
      localStorage.remove(keyCurrentUser)
    },
    setTokens: (state: AuthState, { payload }: PayloadAction<Tokens>) => {
      state.tokens = payload
      cookiesStorage.set(keyTokens, payload)
    },
    setCurrentUser: (state: AuthState, { payload }: PayloadAction<CurrentUser>) => {
      state.currentUser = payload
      localStorage.set(keyCurrentUser, payload)
    },
  },
})

export const { signIn, signUp, signOut, success, failed, setTokens, setCurrentUser } = authSlice.actions
export default authSlice.reducer
