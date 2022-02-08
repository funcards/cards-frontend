import React, { useCallback } from 'react';
import { RiCheckLine } from 'react-icons/ri';

import { Theme } from '@/types';
import { useAppDispatch } from '@/hooks';
import { editBoard } from '@/store';

import styles from './BoardColor.module.scss';

export type BoardColorProps = {
  boardId: string;
  color: string;
};

export const BoardColor: React.FC<BoardColorProps> = ({ boardId, color }) => {
  const dispatch = useAppDispatch();

  const onChange = useCallback(
    (data) => {
      dispatch(editBoard({ board_id: boardId, color: data }));
    },
    [boardId, dispatch]
  );

  return (
    <div className={styles.boardColor}>
      {Object.values(Theme)
        .filter((t) => t !== Theme.NoColor)
        .map((t) => (
          <React.Fragment key={t}>
            {t === color ? (
              <div data-theme={t} className={`${styles.boardColor__item} ${styles.boardColor__item_selected}`}>
                <RiCheckLine />
              </div>
            ) : (
              <div data-theme={t} className={styles.boardColor__item} onClick={() => onChange(t)} />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};
