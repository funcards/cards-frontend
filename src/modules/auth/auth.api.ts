import axios from 'axios'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { endpoints } from '~src/utils/constants'
import { SignIn, SignUp, Tokens } from './auth.types'

const config: AxiosAuthRefreshRequestConfig = { skipAuthRefresh: true }

const normalize = (response: any): Tokens => {
  return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token }
}

const login = (dto: SignIn): Promise<Tokens> => {
  return axios.post(endpoints.auth.login, dto, config).then(normalize)
}

const signUp = (dto: SignUp): Promise<Tokens> => {
  return axios.post(endpoints.auth.signUp, dto, config).then(normalize)
}

export { login, signUp }
