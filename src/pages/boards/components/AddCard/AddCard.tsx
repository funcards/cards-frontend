import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import * as yup from 'yup';
import { TiChevronLeft, TiPlus, TiTimes } from 'react-icons/ti';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';

import { useAppDispatch, useAppSelector, useDropdownMenu, useSwitchElement } from '@/hooks';
import { Button, DdMenu, DdMenuHeader, DdMenuHeaderButton, DdMenuItem, DdMenuItems, TextField } from '@/components';
import { SwitchFormFooter } from '@/pages/boards/components';
import { newCard, selectCards } from '@/store';
import { cardName } from '@/validators';
import { DraftCard } from '@/types';

import styles from './AddCard.module.scss';

enum MenuStatus {
  Labels = 'Labels',
  NewLabel = 'Create label',
}

type MenuState =
  | {
      status: MenuStatus.Labels;
      isPrev: false;
      isLabels: true;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.NewLabel;
      isPrev: true;
      isLabels: false;
      isNewLabel: true;
    };

const MENU_PREV = 'PREV';
const MENU_LABELS = 'LABELS';
const MENU_NEW_LABEL = 'NEW_LABEL';

type MenuAction = { type: 'PREV' } | { type: 'LABELS' } | { type: 'NEW_LABEL' };

const getMenuState = (status: MenuStatus): MenuState => {
  return {
    status,
    isLabels: status === MenuStatus.Labels,
    isNewLabel: status === MenuStatus.NewLabel,
  } as MenuState;
};

const initialMenuState = getMenuState(MenuStatus.Labels);

const reducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case MENU_PREV:
    case MENU_LABELS:
      return getMenuState(MenuStatus.Labels);
    case MENU_NEW_LABEL:
      return getMenuState(MenuStatus.NewLabel);
    default:
      throw new Error();
  }
};

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

  const [menuState, menuDispatch] = useReducer(reducer, initialMenuState);

  const onPrev = useCallback(() => menuDispatch({ type: 'PREV' }), [menuDispatch]);

  const closeFn = useCallback(() => {
    setIsOn(true);
    menuDispatch({ type: 'LABELS' });
  }, [setIsOn]);

  const openFn = useCallback(() => setIsOn(false), [setIsOn]);

  const {
    buttonRef,
    menuRef,
    menuStyle,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDropdownMenu({ closeFn, openFn });

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
      <div
        className={
          isOpened ? `${styles.addCard__container} ${styles.addCard__container_open}` : styles.addCard__container
        }
      >
        <div className={styles.addCard__tags}>
          <Button type="button" primary={true} className={styles.addCard__tag} data-theme="sky" />
          <Button type="button" primary={true} className={styles.addCard__tag} data-theme="red" />
          <Button type="button" primary={true} className={styles.addCard__tag} data-theme="orange" />
        </div>
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
            <IoEllipsisHorizontalOutline />
          </button>
          <DdMenu ref={menuRef} style={menuStyle}>
            <DdMenuHeader>
              {menuState.isPrev && (
                <DdMenuHeaderButton left={true} onClick={onPrev}>
                  <TiChevronLeft />
                </DdMenuHeaderButton>
              )}
              {menuState.status}
              <DdMenuHeaderButton onClick={onCloseMenu}>
                <TiTimes />
              </DdMenuHeaderButton>
            </DdMenuHeader>
            {menuState.isLabels && <DdMenuItems>TODO: Labels</DdMenuItems>}
            {menuState.isNewLabel && <DdMenuItems>TODO: New label</DdMenuItems>}
          </DdMenu>
        </>
      </SwitchFormFooter>
    </form>
  );
};
