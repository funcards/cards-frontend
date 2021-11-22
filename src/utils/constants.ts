export const isProduction = process.env.NODE_ENV === 'production'
export const apiUrl: string = process.env.APP_API_URL ?? 'http://localhost:8081'

export const appName = Object.freeze({
  long: process.env.APP_LONG_NAME ?? 'FunCards',
  short: process.env.APP_SHORT_NAME ?? 'FC',
})

export const themes = ['sky', 'blue', 'indigo', 'red', 'pink', 'orange', 'yellow', 'lime', 'green', 'gray']

const api = '/api/v1'

export const endpoints = Object.freeze({
  auth: Object.freeze({ signUp: `${api}/sign-up`, login: `${api}/sign-in`, refreshToken: `${api}/refresh-token` }),
  user: Object.freeze({ list: `${api}/users`, me: `${api}/users/me` }),
  board: Object.freeze({ list: `${api}/boards`, one: (id: string) => `${api}/boards/${id}` }),
})

export const routes = Object.freeze({
  root: '/',
})

export const validation = Object.freeze({
  email: /\S+@\S+\.\S+/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/,
})

export const dndTypes = Object.freeze({
  category: 'CATEGORY',
  card: 'CARD',
})
