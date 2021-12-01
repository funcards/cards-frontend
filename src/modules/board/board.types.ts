import * as dayjs from 'dayjs';

export interface Member {
  user_id: string
  roles: string[]
}

export interface Board {
  board_id: string
  name: string
  color: string
  description: string
  created_at: dayjs.Dayjs
  members: Record<string, Member>
}

export interface BoardState {
  list: Record<string, Board>
  currentBoard?: Board
  loading: boolean
}
