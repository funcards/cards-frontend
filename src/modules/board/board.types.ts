import { ErrorState } from '~src/modules/common/common.types'

export interface Collection<T> {
  ids: string[]
  items: Record<string, T>
}

export interface DraftBoard {
  name: string
  color: string
  description: string
}

export interface DraftCategory {
  board_id: string
  name: string
  position: number
}

export interface DraftCard {
  board_id: string
  category_id: string
  name: string
  position: number
}

export interface DraftTag {
  board_id: string
  name: string
  color: string
}

export interface Tag {
  tag_id: string
  board_id: string
  name: string
  color: string
}

export interface Card {
  card_id: string
  board_id: string
  category_id: string
  name: string
  content: string
  position: number
  tags: string[]
}

export interface Category {
  category_id: string
  board_id: string
  name: string
  position: number
}

export interface Member {
  user_id: string
  name: string
  email: string
  roles: string[]
}

export interface Board {
  board_id: string
  name: string
  color: string
  description: string
  created_at: string
  members: Record<string, Member>
  tags?: Record<string, Tag>
  categories?: Collection<Category>
  cards?: Collection<Card>
}

export interface BoardState extends Collection<Board>, ErrorState {
  newBoardIsOpen: boolean
}

export enum BoardStateStatus {
  Success = 'SUCCESS',
  Error = 'ERROR',
  LoadOneBoard = 'LOAD_ONE_BOARD',
  LoadBoardList = 'LOAD_BOARD_LIST',
  NewBoard = 'NEW_BOARD',
  NewCategory = 'NEW_CATEGORY',
  NewTag = 'NEW_TAG',
  NewCard = 'NEW_CARD',
}
