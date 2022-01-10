import React, { useCallback } from 'react'

import { useAppDispatch } from '~src/store'
import { openAddBoard } from '~src/store/ui/ui.slice'

import * as classes from './BoardListAdd.module.scss'

export const BoardListAdd: React.FC = () => {
  const dispatch = useAppDispatch()
  const onOpenNewBoard = useCallback(() => dispatch(openAddBoard()), [dispatch])

  return (
    <button className={classes.boardListAdd} onClick={onOpenNewBoard}>
      Create new board
    </button>
  )
}
