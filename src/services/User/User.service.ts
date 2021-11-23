import axios from 'axios'

import { User } from '~src/store/types'
import { endpoints } from '~src/utils/constants'

class UserService {
  public me(): Promise<User> {
    return axios.get(endpoints.user.me).then(resp => resp.data)
  }
}

export const userService = new UserService()
