import React from 'react'

import { BoardListAdd, BoardListItem } from '~src/pages/board/components'
import { Board } from '~src/store/board/board.types'

import * as classes from './BoardList.module.scss'

export type BoardListProps = {
  boards: Board[]
}

export const BoardList: React.FC<BoardListProps> = ({ boards }) => (
  <div className={classes.boardList}>
    {boards.map((board) => (
      <BoardListItem key={board.board_id} board={board} />
    ))}
    <BoardListAdd />
  </div>
)
