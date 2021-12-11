import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ErrorResponse } from '../types'

import { AuthState, CurrentUser, SignIn, SignUp, Tokens } from './auth.types'

import { Cookies, LocalStorage } from '~src/services'

const keyTokens = 'tokens'
const keyCurrentUser = 'current.user'
const tokens = Cookies.get<Tokens | undefined>(keyTokens, undefined)
const currentUser = LocalStorage.get<CurrentUser | undefined>(keyCurrentUser, undefined)
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
      Cookies.remove(keyTokens)
      LocalStorage.remove(keyCurrentUser)
    },
    successAuth: (state: AuthState) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.isError = false
      state.error = undefined
    },
    failedAuth: (state: AuthState, { payload }: PayloadAction<ErrorResponse>) => {
      state.isAuthenticated = false
      state.isLoading = false
      state.isError = true
      state.error = payload
      state.tokens = undefined
      state.currentUser = undefined
      Cookies.remove(keyTokens)
      LocalStorage.remove(keyCurrentUser)
    },
    setTokens: (state: AuthState, { payload }: PayloadAction<Tokens>) => {
      state.tokens = payload
      Cookies.set(keyTokens, payload)
    },
    setCurrentUser: (state: AuthState, { payload }: PayloadAction<CurrentUser>) => {
      state.currentUser = payload
      LocalStorage.set(keyCurrentUser, payload)
    },
  },
})

export const { signIn, signUp, signOut, successAuth, failedAuth, setTokens, setCurrentUser } = authSlice.actions
export default authSlice.reducer
