import { EntityState } from '@reduxjs/toolkit'

export interface User {
  user_id: string
  name: string
  email: string
}

export type UserState = EntityState<User> & { currentUser?: User }
