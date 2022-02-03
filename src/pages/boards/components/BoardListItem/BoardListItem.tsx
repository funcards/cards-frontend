import React from 'react';
import { Link } from 'react-router-dom';

import { Board } from '@/types';
import { routes } from '@/config';

import styles from './BoardListItem.module.scss';

export interface BoardListItemProps {
  board: Board;
}

export const BoardListItem: React.FC<BoardListItemProps> = ({ board }) => (
  <Link to={routes.board.one(board.board_id)} className={styles.boardListItem} data-theme={board.color}>
    <span className={styles.boardListItem__name}>{board.name}</span>
  </Link>
);
