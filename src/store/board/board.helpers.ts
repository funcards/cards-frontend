import dayjs from 'dayjs'

import { Board, BoardState, Card, Category } from './board.types'

export type SortFunc = {
  (a: Board, b: Board): number
  (a: Category, b: Category): number
  (a: Card, b: Card): number
}

export const isBoard = (o: Board | Category | Card): o is Board => {
  return (o as Board).created_at !== undefined && (o as Board).members !== undefined
}

export const sortFn: SortFunc = (a, b) => {
  if (isBoard(a) && isBoard(b)) {
    return dayjs(a.created_at).diff(b.created_at)
  }

  return (a as { position: number }).position - (b as { position: number }).position
}

export const safeBoardApplyFn = (state: BoardState, boardId: string, fn: (board: Board) => void) => {
  const board = state.boards.find((b) => b.board_id === boardId)
  board && fn(board)
}
