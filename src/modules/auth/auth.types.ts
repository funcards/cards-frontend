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

export interface AuthState {
  isAuthenticated: boolean
  tokens?: Tokens
}
