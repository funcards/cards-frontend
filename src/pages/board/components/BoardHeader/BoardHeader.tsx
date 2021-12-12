import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'
import { RiUserAddLine } from 'react-icons/ri'

import * as classes from './BoardHeader.module.scss'

import { Board } from '~src/store/board/board.types'
import { Avatar, AvatarGroup, Button, Text } from '~src/ui-kit'
import { EditBoardName } from '~src/pages/board/components'

export interface BoardHeaderProps {
  board: Board
  menuIsOpened: boolean
  onOpenMenu: () => void
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, menuIsOpened, onOpenMenu }) => {
  const members = useMemo(() => Object.values(board.members), [board.members])

  return (
    <div className={classes.boardHeader}>
      <div className={classes.boardHeader__group}>
        <EditBoardName board={board} />
        <div className={classes.boardHeader__divide} />
        <AvatarGroup>
          {members.map((m, i) => (
            <Link className={classes.boardHeader__avatar} key={i} to={`/profile/${m.user_id}`}>
              <Avatar alt={m.name} src={m.email} />
            </Link>
          ))}
        </AvatarGroup>
        <Button
          className={classes.boardHeader__btn}
          light={true}
          show="md"
          text={{ children: 'Invite' }}
          textAppend={true}
        >
          <RiUserAddLine />
        </Button>
      </div>
      <div className={classes.boardHeader__group}>
        {!menuIsOpened && (
          <Button className={classes.boardHeader__btn} onClick={onOpenMenu} light={true}>
            <IoEllipsisHorizontalOutline />
            <Text show="md">Show menu</Text>
          </Button>
        )}
      </div>
    </div>
  )
}
