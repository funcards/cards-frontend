import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { RiUserAddLine } from 'react-icons/ri';

import { Board } from '@/types';
import { Avatar, AvatarGroup, Button, Text } from '@/components';

import { BoardName } from '..';

import styles from './BoardHeader.module.scss';

export interface BoardHeaderProps {
  board: Board;
  menuIsOpened: boolean;
  onOpenMenu: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, menuIsOpened, onOpenMenu }) => {
  const members = useMemo(() => Object.values(board.members), [board.members]);

  return (
    <div className={styles.boardHeader}>
      <div className={styles.boardHeader__group}>
        <BoardName boardId={board.board_id} name={board.name} />
        <div className={styles.boardHeader__divide} />
        <AvatarGroup>
          {members.map((m, i) => (
            <Link className={styles.boardHeader__avatar} key={i} to={`/profile/${m.user_id}`}>
              <Avatar alt={m.name} src={m.email} />
            </Link>
          ))}
        </AvatarGroup>
        <Button className={styles.boardHeader__btn} light={true} show="md">
          <RiUserAddLine />
          <Text>Invite</Text>
        </Button>
      </div>
      <div className={styles.boardHeader__group}>
        <Button
          className={
            menuIsOpened ? `${styles.boardHeader__btn} ${styles.boardHeader__btn_hide}` : styles.boardHeader__btn
          }
          onClick={onOpenMenu}
          light={true}
        >
          <IoEllipsisHorizontalOutline />
          <Text show="md">Show menu</Text>
        </Button>
      </div>
    </div>
  );
};
