import React, { useCallback } from 'react';

import { useAppDispatch } from '@/hooks';
import { openAddBoard } from '@/store';

import styles from './BoardListAdd.module.scss';

export const BoardListAdd: React.FC = () => {
  const dispatch = useAppDispatch();
  const onOpenNewBoard = useCallback(() => dispatch(openAddBoard()), [dispatch]);

  return (
    <button className={styles.boardListAdd} onClick={onOpenNewBoard}>
      Create new board
    </button>
  );
};
