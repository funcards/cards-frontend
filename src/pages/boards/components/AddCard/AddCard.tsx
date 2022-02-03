import React, { useCallback, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { TiPlus } from 'react-icons/ti';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { TextField } from '@/components';
import { SwitchFormFooter } from '@/pages/boards/components';
import { newCard, selectCards } from '@/store';
import { cardName } from '@/validators';

import styles from './AddCard.module.scss';

export interface AddCardProps {
  label: string;
  boardId: string;
  categoryId: string;
  position: number;
  boardColor: string;
  prependAddCard?: boolean | undefined;
  onClose?: () => void;
}

const schema = yup.object({
  name: cardName,
});

export const AddCard: React.FC<AddCardProps> = ({
  label,
  boardId,
  categoryId,
  position,
  boardColor,
  prependAddCard,
  onClose: onCloseFn,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectCards);
  const { ref, isOpened, onOpen, onClose, setIsOn } = useSwitchElement<HTMLFormElement>(prependAddCard, onCloseFn);

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
      dispatch(newCard({ board_id: boardId, category_id: categoryId, position, tags: [], name: data.name }));
      reset();
      setFocus('name');
    },
    [dispatch, reset, setFocus, boardId, categoryId, position]
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
      className={isOpened ? `${styles.addCard} ${styles.addCard_open}` : styles.addCard}
    >
      <button
        onClick={onOpen}
        className={isOpened ? `${styles.addCard__openBtn} ${styles.addCard__openBtn_open}` : styles.addCard__openBtn}
      >
        <TiPlus className={styles.addCard__plusIcon} />
        {label}
      </button>
      <TextField
        placeholder="Enter a title for this card..."
        multiLine={true}
        className={isOpened ? `${styles.addCard__input} ${styles.addCard__input_open}` : styles.addCard__input}
        {...register('name')}
      />
      <SwitchFormFooter
        isOpened={isOpened}
        isLoading={isLoading}
        isDisabled={isDisabled}
        boardColor={boardColor}
        label="Add card"
        onClose={onClose}
      />
    </form>
  );
};
