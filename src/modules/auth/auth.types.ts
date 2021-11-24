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
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  isAuthenticated: boolean
  tokens?: Tokens
  loading: boolean
}
