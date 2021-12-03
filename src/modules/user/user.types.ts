import { EntityState } from '@reduxjs/toolkit'

import { ErrorState } from '~src/modules/common/common.types'

export interface User {
  user_id: string
  name: string
  email: string
}

export interface UserState extends EntityState<User>, ErrorState {}
