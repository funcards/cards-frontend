import React from 'react';

import { Board } from '@/types';

import { BoardListAdd, BoardListItem } from '..';

import styles from './BoardList.module.scss';

export type BoardListProps = {
  boards: Board[];
};

export const BoardList: React.FC<BoardListProps> = ({ boards }) => (
  <div className={styles.boardList}>
    {boards.map((board) => (
      <BoardListItem key={board.board_id} board={board} />
    ))}
    <BoardListAdd />
  </div>
);
