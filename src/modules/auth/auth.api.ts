import axios from 'axios'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { endpoints } from '~src/utils/constants'
import { SignIn, SignUp, Tokens } from './auth.types'

const config: AxiosAuthRefreshRequestConfig = { skipAuthRefresh: true }

const toTokens = (response: any): Tokens => {
  return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token }
}

export const signIn = (dto: SignIn): Promise<Tokens> => {
  return axios.post(endpoints.auth.signIn, dto, config).then(toTokens)
}

export const signUp = (dto: SignUp): Promise<Tokens> => {
  return axios.post(endpoints.auth.signUp, dto, config).then(toTokens)
}
