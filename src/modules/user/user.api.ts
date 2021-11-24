import axios from 'axios'

import { endpoints } from '~src/utils/constants'
import { User } from './user.types'

const me = (): Promise<User> => {
  return axios.get(endpoints.user.me).then(resp => resp.data)
}

export { me }
