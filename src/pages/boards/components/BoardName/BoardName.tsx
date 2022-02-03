import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { Button, TextField, Text } from '@/components';
import { boardName } from '@/validators';
import { editBoard, selectBoards } from '@/store';

import styles from './BoardName.module.scss';

export interface BoardNameProps {
  boardId: string;
  name: string;
}

export const BoardName: React.FC<BoardNameProps> = ({ boardId: board_id, name: oldName }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectBoards);
  const [isValid, setIsValid] = useState(true);
  const [style, setStyle] = useState({ width: '0px' });
  const [newName, setNewName] = useState(oldName);
  const spanRef: React.MutableRefObject<HTMLSpanElement | null> = useRef<HTMLSpanElement>(null);
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const closeFn = useCallback(() => {
    if (!boardName.isValidSync(newName) || newName === oldName) {
      return;
    }
    dispatch(editBoard({ board_id, name: newName }));
  }, [board_id, dispatch, newName, oldName]);

  const { ref, isOpened, onOpen, onClose, setIsOn } = useSwitchElement<HTMLDivElement>(false, closeFn);

  const onChange = (e: any) => setNewName(e.target.value);

  const onSubmit = (e: any) => {
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    setIsOn(!isLoading);
  }, [isLoading, setIsOn]);

  useEffect(() => {
    setStyle({
      width: `${spanRef.current?.offsetWidth ?? 0}px`,
    });
    setIsValid(boardName.isValidSync(newName));
  }, [newName]);

  useEffect(() => {
    if (isOpened && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpened]);

  return (
    <div ref={ref}>
      <Button
        onClick={onOpen}
        className={isOpened ? `${styles.boardName__btn} ${styles.boardName__btn_opened}` : styles.boardName__btn}
        light={true}
        spinner={isLoading}
      >
        <Text>{oldName}</Text>
      </Button>
      <span ref={spanRef} className={styles.boardName__helper}>
        {newName}
      </span>
      <form
        onSubmit={onSubmit}
        className={isOpened ? `${styles.boardName__form} ${styles.boardName__form_opened}` : styles.boardName__form}
      >
        <TextField
          error={!isValid}
          readOnly={isLoading}
          ref={inputRef}
          value={newName}
          onChange={onChange}
          style={style}
          className={styles.boardName__input}
        />
      </form>
    </div>
  );
};
