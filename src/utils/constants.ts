export const isProduction = process.env.NODE_ENV === 'production'
export const apiUrl: string = process.env.APP_API_URL ?? 'http://localhost:8080'

export const appName = Object.freeze({
  long: process.env.APP_LONG_NAME ?? 'FunCards',
  short: process.env.APP_SHORT_NAME ?? 'FC',
})

const api = '/api/v1'

export const endpoints = Object.freeze({
  auth: Object.freeze({ signUp: `${api}/sign-up`, signIn: `${api}/sign-in`, refreshToken: `${api}/refresh-token` }),
  user: Object.freeze({ list: `${api}/users`, me: `${api}/users/me` }),
  board: Object.freeze({ list: `${api}/boards`, one: (id: string) => `${api}/boards/${id}` }),
})

export const routes = Object.freeze({
  root: '/',
  auth: Object.freeze({ signIn: '/sign-in', signUp: '/sign-up', forgotPassword: '/forgot' }),
  board: Object.freeze({ list: '/boards', one: (id = ':boardId') => `/boards/${id}` }),
})

export const validation = Object.freeze({
  email: /\S+@\S+\.\S+/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/,
})
