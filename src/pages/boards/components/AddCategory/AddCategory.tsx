import React, { useCallback, useEffect, useMemo } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { newCategory, selectCategories } from '@/store';
import { TextField } from '@/components';
import { categoryName } from '@/validators';

import { SwitchFormFooter } from '..';

import styles from './AddCategory.module.scss';

export interface AddCategoryProps {
  boardId: string;
  boardColor: string;
  position: number;
}

const schema = yup.object({ name: categoryName }).required();

export const AddCategory: React.FC<AddCategoryProps> = ({ boardId, boardColor, position }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectCategories);
  const { ref, isOpened, onOpen, onClose, setIsOn } = useSwitchElement<HTMLFormElement>();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid]);

  const onSubmit = useCallback(
    (data) => {
      dispatch(newCategory({ board_id: boardId, position, name: data.name }));
      reset();
      setFocus('name');
    },
    [dispatch, reset, setFocus, boardId, position]
  );

  useEffect(() => {
    setIsOn(!isLoading);
  }, [isLoading, setIsOn]);

  useEffect(() => {
    if (isOpened) {
      setFocus('name');
    } else {
      reset();
    }
  }, [isOpened, setFocus, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      className={isOpened ? `${styles.addCategory} ${styles.addCategory_open}` : styles.addCategory}
    >
      <button
        onClick={onOpen}
        className={
          isOpened ? `${styles.addCategory__openBtn} ${styles.addCategory__openBtn_open}` : styles.addCategory__openBtn
        }
      >
        <TiPlus className={styles.addCategory__plusIcon} />
        Add another list
      </button>
      <TextField
        type="text"
        autoComplete="off"
        placeholder="Enter list title..."
        data-theme={boardColor}
        className={
          isOpened ? `${styles.addCategory__input} ${styles.addCategory__input_open}` : styles.addCategory__input
        }
        {...register('name')}
      />
      <SwitchFormFooter
        isOpened={isOpened}
        isLoading={isLoading}
        isDisabled={isDisabled}
        boardColor={boardColor}
        label="Add list"
        onClose={onClose}
      />
    </form>
  );
};
