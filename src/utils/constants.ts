export const isProduction = process.env.NODE_ENV === 'production'
export const url: string = process.env.APP_API_URL ?? 'http://localhost:8080'
export const apiV1 = `${url}/api/v1`

export const appName = Object.freeze({
  long: process.env.APP_LONG_NAME ?? 'FunCards',
  short: process.env.APP_SHORT_NAME ?? 'FC',
})

export const routes = Object.freeze({
  root: '/',
  auth: Object.freeze({ signIn: '/sign-in', signUp: '/sign-up', forgotPassword: '/forgot' }),
  board: Object.freeze({ list: '/boards', add: '/boards/add', one: (id = ':boardId') => `/boards/${id}` }),
})

export const validation = Object.freeze({
  email: /\S+@\S+\.\S+/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/,
})
