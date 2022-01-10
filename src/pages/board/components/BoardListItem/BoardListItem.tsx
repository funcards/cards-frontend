import React from 'react'
import { Link } from 'react-router-dom'

import { Board } from '~src/store/board/board.types'
import { routes } from '~src/utils/constants'

import * as classes from './BoardListItem.module.scss'

export interface BoardListItemProps {
  board: Board
}

export const BoardListItem: React.FC<BoardListItemProps> = ({ board }) => (
  <Link to={routes.board.one(board.board_id)} className={classes.boardListItem} data-theme={board.color}>
    <span className={classes.boardListItem__name}>{board.name}</span>
  </Link>
)
