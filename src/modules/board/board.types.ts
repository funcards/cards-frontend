import * as dayjs from 'dayjs';

export interface Member {
  userId: string
  roles: string[]
}

export interface Board {
  boardId: string
  name: string
  color: string
  description: string
  createdAt: dayjs.Dayjs
  members: Record<string, Member>
}

export interface BoardState {
  list: Record<string, Board>
  currentBoard?: Board
  loading: boolean
}
