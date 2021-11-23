import axios from 'axios'
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'

import { endpoints } from '~src/utils/constants'
import { SignIn, SignUp, Tokens } from '~src/store/types'

class AuthService {
  private readonly config: AxiosAuthRefreshRequestConfig;

  public constructor() {
    this.config = { skipAuthRefresh: true }
  }

  public login(dto: SignIn): Promise<Tokens> {
    return axios.post(endpoints.auth.login, dto, this.config).then(AuthService.normalize)
  }

  public signUp(dto: SignUp): Promise<Tokens> {
    return axios.post(endpoints.auth.signUp, dto, this.config).then(AuthService.normalize)
  }

  private static normalize(response: any): Tokens {
    return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token }
  }
}

export const authService = new AuthService()
