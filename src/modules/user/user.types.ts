export interface User {
  user_id: string
  name: string
  email: string
}

export interface UserState {
  currentUser?: User
}
