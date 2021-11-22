export interface ValidationErrors {
  [key: string]: string[]
}

export interface ErrorResponse {
  type: string
  title: string
  status: number
  message: string
  errors?: ValidationErrors
}

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

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  isAuthenticated: boolean
  currentUser?: User
  tokens?: Tokens
  loading: boolean
}

export enum NotifyType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface Notification {
  id?: string
  type?: NotifyType
  title?: string
  message: string
  dismiss?: number
}

export interface NotificationsState {
  notifications: Notification[]
}

export interface RootState {
  authState: AuthState
  notificationsState: NotificationsState
}
