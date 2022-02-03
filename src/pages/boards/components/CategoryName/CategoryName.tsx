import React, { useCallback, useEffect, useRef, useState } from 'react';

import { TextField } from '@/components';
import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { editCategory, selectCategories } from '@/store';
import { categoryName } from '@/validators';

import styles from './CategoryName.module.scss';

export interface CategoryNameProps {
  boardId: string;
  categoryId: string;
  name: string;
}

export const CategoryName: React.FC<CategoryNameProps> = ({ boardId, categoryId, name: oldName }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectCategories);
  const [isValid, setIsValid] = useState(true);
  const [newName, setNewName] = useState(oldName);
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const closeFn = useCallback(() => {
    if (!categoryName.isValidSync(newName) || newName === oldName) {
      return;
    }
    dispatch(editCategory({ board_id: boardId, category_id: categoryId, name: newName }));
  }, [boardId, categoryId, dispatch, newName, oldName]);

  const { ref, isOpened, onOpen, onClose, setIsOn } = useSwitchElement<HTMLFormElement>(false, closeFn);

  const onChange = (e: any) => setNewName(e.target.value);

  const onSubmit = (e: any) => {
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    setIsOn(!isLoading);
  }, [isLoading, setIsOn]);

  useEffect(() => {
    setIsValid(categoryName.isValidSync(newName));
  }, [newName]);

  useEffect(() => {
    if (isOpened && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpened]);

  return (
    <form ref={ref} className={styles.categoryName} onSubmit={onSubmit}>
      <h2
        className={
          isOpened ? `${styles.categoryName__name} ${styles.categoryName__name_opened}` : styles.categoryName__name
        }
        onClick={onOpen}
      >
        {oldName}
      </h2>
      <TextField
        error={!isValid}
        readOnly={isLoading}
        ref={inputRef}
        value={newName}
        onChange={onChange}
        className={
          isOpened ? `${styles.categoryName__input} ${styles.categoryName__input_opened}` : styles.categoryName__input
        }
      />
    </form>
  );
};
