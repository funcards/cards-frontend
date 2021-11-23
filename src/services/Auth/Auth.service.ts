import axios from 'axios'

import { endpoints } from '~src/utils/constants'
import { SignIn, SignUp, Tokens } from '~src/store/types'

class AuthService {
  public login(dto: SignIn): Promise<Tokens> {
    return axios.post(endpoints.auth.login, dto).then(AuthService.normalize)
  }

  public signUp(dto: SignUp): Promise<Tokens> {
    return axios.post(endpoints.auth.signUp, dto).then(AuthService.normalize)
  }

  private static normalize(response: any): Tokens {
    return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token }
  }
}

export default new AuthService()
