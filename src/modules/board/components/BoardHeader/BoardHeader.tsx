import React, { useMemo } from 'react'
import { TiLockClosedOutline, TiLockOpenOutline } from 'react-icons/ti'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import * as classes from './BoardHeader.module.scss'

import { Board } from '~src/modules/board/board.types'
import { Gravatar } from '~src/modules/common/components/Gravatar/Gravatar'

export interface BoardHeaderProps {
  board: Board
  isOpenMenu: boolean
  onOpenMenu: () => void
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, isOpenMenu, onOpenMenu }) => {
  const isShared = useMemo(() => Object.keys(board.members).length > 1, [board.members])

  return (
    <div className={classes.boardHeader}>
      <div className={classes.boardHeader__group}>
        <button className={classes.boardHeaderBtn}>
          <span className={`${classes.boardHeaderBtn__text} ${classes.boardHeaderBtn__text_bold}`}>{board.name}</span>
        </button>
        <div className={classes.boardHeader__divide} />
        <button className={classes.boardHeaderBtn}>
          {isShared ? (
            <>
              <TiLockOpenOutline className={classes.boardHeaderBtn__icon} />
              <span className={`${classes.boardHeaderBtn__text} ${classes.boardHeaderBtn__text_md}`}>Shared</span>
            </>
          ) : (
            <>
              <TiLockClosedOutline className={classes.boardHeaderBtn__icon} />
              <span className={`${classes.boardHeaderBtn__text} ${classes.boardHeaderBtn__text_md}`}>Private</span>
            </>
          )}
        </button>
        <div className={classes.boardHeader__divide} />
        <div className={classes.boardHeader__userGroup}>
          {Object.values(board.members).map((m, i) => (
            <button key={i} className={`${classes.boardHeaderBtn} ${classes.boardHeaderBtn_circle}`}>
              <Gravatar alt={m.name} email={m.email} />
            </button>
          ))}
        </div>
        <button className={`${classes.boardHeaderBtn} ${classes.boardHeaderBtn_md}`}>
          <span className={classes.boardHeaderBtn__text}>Invite</span>
        </button>
      </div>
      <div className={classes.boardHeader__group}>
        {!isOpenMenu && (
          <button className={classes.boardHeaderBtn} onClick={onOpenMenu}>
            <IoEllipsisHorizontalOutline className={classes.boardHeaderBtn__icon} />
            <span className={`${classes.boardHeaderBtn__text} ${classes.boardHeaderBtn__text_md}`}>Show menu</span>
          </button>
        )}
      </div>
    </div>
  )
}
