import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { RiAddLine, RiMoreFill } from 'react-icons/ri';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { Button, TextField } from '@/components';
import { SwitchFormFooter, TagListMenu } from '@/pages/boards/components';
import { newCard, selectBoardTagsByIds, selectCards } from '@/store';
import { cardName } from '@/validators';
import { DraftCard, Tag, Theme } from '@/types';

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
  const {
    ref: formRef,
    isOpened,
    onOpen,
    onClose,
    setIsOn,
  } = useSwitchElement<HTMLFormElement>(prependAddCard, onCloseFn);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    setFocus,
    reset,
    formState: { isDirty, isValid },
  } = useForm<DraftCard>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { board_id: boardId, category_id: categoryId, position, tags: [], name: '' },
  });

  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid]);

  const onSubmit = useCallback(
    (data) => {
      dispatch(newCard(data));
      reset();
      setFocus('name');
    },
    [dispatch, reset, setFocus]
  );

  const onSelect = useCallback(
    (tag: Tag) => {
      const newSelected = getValues('tags').find((i) => i === tag.tag_id)
        ? getValues('tags').filter((i) => i !== tag.tag_id)
        : [...getValues('tags'), tag.tag_id];
      setValue('tags', newSelected, { shouldValidate: true });
    },
    [getValues, setValue]
  );

  const tags = useAppSelector((state) =>
    selectBoardTagsByIds(state, { board_id: boardId, tags_id: getValues('tags') })
  );

  const onDelete = useCallback(() => {
    setValue(
      'tags',
      getValues('tags').filter((id) => !!tags.find((t) => t.tag_id === id)),
      { shouldValidate: true }
    );
  }, [getValues, setValue, tags]);

  const closeFn = useCallback(() => setIsOn(true), [setIsOn]);
  const openFn = useCallback(() => setIsOn(false), [setIsOn]);

  const buttonRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const {
    ref: menuRef,
    isOpened: isOpenedMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useSwitchElement<HTMLDivElement>(false, closeFn, openFn);

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
      ref={formRef}
      className={isOpened ? `${styles.addCard} ${styles.addCard_open}` : styles.addCard}
    >
      <button
        onClick={onOpen}
        className={isOpened ? `${styles.addCard__openBtn} ${styles.addCard__openBtn_open}` : styles.addCard__openBtn}
      >
        <RiAddLine className={styles.addCard__plusIcon} />
        {label}
      </button>
      <div
        className={
          isOpened ? `${styles.addCard__container} ${styles.addCard__container_open}` : styles.addCard__container
        }
      >
        {tags.filter((t) => t.color !== Theme.NoColor).length > 0 && (
          <div className={styles.addCard__tags}>
            {tags
              .filter((t) => t.color !== Theme.NoColor)
              .map((tag) => (
                <Button
                  key={tag.tag_id}
                  type="button"
                  primary={true}
                  className={styles.addCard__tag}
                  data-theme={tag.color}
                />
              ))}
          </div>
        )}
        <TextField
          placeholder="Enter a title for this card..."
          multiLine={true}
          className={styles.addCard__input}
          {...register('name')}
        />
      </div>
      <SwitchFormFooter
        isOpened={isOpened}
        isLoading={isLoading}
        isDisabled={isDisabled}
        boardColor={boardColor}
        label="Add card"
        onClose={onClose}
      >
        <>
          <button type="button" ref={buttonRef} className={styles.addCard__menuBtn} onClick={onOpenMenu}>
            <RiMoreFill />
          </button>
          <TagListMenu
            menuRef={menuRef}
            targetRef={buttonRef}
            isOpened={isOpenedMenu}
            boardId={boardId}
            selected={getValues('tags')}
            onSelect={onSelect}
            onClose={onCloseMenu}
            onDelete={onDelete}
          />
        </>
      </SwitchFormFooter>
    </form>
  );
};
