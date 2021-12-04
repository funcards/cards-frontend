import { EntityState } from '@reduxjs/toolkit'

import { ErrorState } from '~src/modules/common/common.types'

export interface Member {
  user_id: string
  roles: string[]
}

export interface DraftBoard {
  name: string
  color: string
  description: string
}

export interface Board {
  board_id: string
  name: string
  color: string
  description: string
  created_at: string
  members: Member[]
}

export interface BoardState extends EntityState<Board>, ErrorState {
  newBoardIsOpen: boolean
}

export enum BoardStateStatus {
  Success = 'SUCCESS',
  Error = 'ERROR',
  NewBoard = 'NEW_BOARD',
  LoadOneBoard = 'LOAD_ONE_BOARD',
  LoadBoardList = 'LOAD_BOARD_LIST',
}
