export interface User {
  userId: string
  name: string
  email: string
}

export interface UserState {
  currentUser?: User
}
