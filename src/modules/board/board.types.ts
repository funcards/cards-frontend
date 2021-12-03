import { EntityState } from '@reduxjs/toolkit'
import * as dayjs from 'dayjs'

import { ErrorState } from '~src/modules/common/common.types'

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
  members: Member[]
}

export interface BoardState extends EntityState<Board>, ErrorState {}
