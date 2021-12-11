import { CommonState } from '../types'

export interface SignUp {
  name: string
  email: string
  password: string
}

export interface SignIn {
  email: string
  password: string
}

export interface Tokens {
  access_token: string
  refresh_token: string
}

export interface CurrentUser {
  user_id: string
  name: string
  email: string
}

export interface AuthState extends CommonState {
  isAuthenticated: boolean
  tokens?: Tokens
  currentUser?: CurrentUser
}
