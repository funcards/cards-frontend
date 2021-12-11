import { CommonState } from '../types'

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
  members: Member[]
  tags?: Tag[]
  categories?: Category[]
  cards?: Card[]
}

export interface BoardItems<T> {
  board_id: string
  items: T[]
}

export interface ChangeCategoriesPosition {
  board_id: string
  source: number
  destination: number
}

export interface CardPosition {
  category_id: string
  index: number
}

export interface ChangeCardsPosition {
  board_id: string
  source: CardPosition
  destination: CardPosition
}

export interface BoardState extends CommonState {
  boards: Board[]
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
  ChangeCategoryPosition = 'CHANGE_CATEGORY_POSITION',
  ChangeCardPosition = 'CHANGE_CARD_POSITION',
  EditBoard = 'EDIT_BOARD',
  // EditCategory = 'EDIT_CATEGORY',
  // EditTag = 'EDIT_TAG',
  // EditCard = 'EDIT_CARD',
}
