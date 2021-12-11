import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TiLockClosedOutline, TiLockOpenOutline } from 'react-icons/ti'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import * as classes from './BoardHeader.module.scss'

import { Board } from '~src/store/board/board.types'
import { Avatar, AvatarGroup, Button, Text } from '~src/ui-kit'

export interface BoardHeaderProps {
  board: Board
  menuIsOpened: boolean
  onOpenMenu: () => void
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, menuIsOpened, onOpenMenu }) => {
  const isShared = useMemo(() => Object.keys(board.members).length > 1, [board.members])
  const members = useMemo(() => Object.values(board.members), [board.members])

  return (
    <div className={classes.boardHeader}>
      <div className={classes.boardHeader__group}>
        <Button
          className={`${classes.boardHeader__btn} ${classes.boardHeader_bold}`}
          light={true}
          text={{ children: board.name }}
        />
        <div className={classes.boardHeader__divide} />
        <Button className={classes.boardHeader__btn} light={true}>
          {isShared ? (
            <>
              <TiLockOpenOutline className={classes.boardHeader__icon} />
              <Text show="md">Shared</Text>
            </>
          ) : (
            <>
              <TiLockClosedOutline className={classes.boardHeader__icon} />
              <Text show="md">Private</Text>
            </>
          )}
        </Button>
        <div className={classes.boardHeader__divide} />
        <AvatarGroup>
          {members.map((m, i) => (
            <Link className={classes.boardHeader__avatar} key={i} to={`/profile/${m.user_id}`}>
              <Avatar alt={m.name} src={m.email} />
            </Link>
          ))}
        </AvatarGroup>
        <Button className={classes.boardHeader__btn} light={true} show="md" text={{ children: 'Invite' }} />
      </div>
      <div className={classes.boardHeader__group}>
        {!menuIsOpened && (
          <Button className={classes.boardHeader__btn} onClick={onOpenMenu} light={true}>
            <IoEllipsisHorizontalOutline className={classes.boardHeader__icon} />
            <Text show="md">Show menu</Text>
          </Button>
        )}
      </div>
    </div>
  )
}
