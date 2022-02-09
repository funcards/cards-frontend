import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { RiAddLine, RiMoreFill, RiArrowLeftSLine, RiCloseLine } from 'react-icons/ri';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { Button, DdMenu, DdMenuHeader, DdMenuHeaderButton, DdMenuItems, TextField } from '@/components';
import { AddTag, EditTag, SwitchFormFooter, TagList } from '@/pages/boards/components';
import { newCard, selectBoardTagsByIds, selectCards } from '@/store';
import { cardName } from '@/validators';
import { DraftCard, Tag, Theme } from '@/types';

import styles from './AddCard.module.scss';

enum MenuStatus {
  Labels = 'Labels',
  NewLabel = 'Create label',
  EditLabel = 'Change label',
}

type MenuState = { name?: string | undefined; tag?: Tag | undefined } & (
  | {
      status: MenuStatus.Labels;
      isPrev: false;
      isLabels: true;
      isNewLabel: false;
      isEditLabel: false;
    }
  | {
      status: MenuStatus.NewLabel;
      isPrev: true;
      isLabels: false;
      isNewLabel: true;
      isEditLabel: false;
    }
  | {
      status: MenuStatus.EditLabel;
      isPrev: true;
      isLabels: false;
      isNewLabel: false;
      isEditLabel: true;
    }
);

const MENU_PREV = 'PREV';
const MENU_LABELS = 'LABELS';
const MENU_NEW_LABEL = 'NEW_LABEL';
const MENU_EDIT_LABEL = 'EDIT_LABEL';

type MenuAction =
  | { type: 'PREV' }
  | { type: 'LABELS' }
  | { type: 'NEW_LABEL'; name: string }
  | { type: 'EDIT_LABEL'; tag: Tag };

const getMenuState = (status: MenuStatus): MenuState => {
  return {
    status,
    isPrev: status !== MenuStatus.Labels,
    isLabels: status === MenuStatus.Labels,
    isNewLabel: status === MenuStatus.NewLabel,
    isEditLabel: status === MenuStatus.EditLabel,
  } as MenuState;
};

const initialMenuState = getMenuState(MenuStatus.Labels);

const reducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case MENU_PREV:
    case MENU_LABELS:
      return getMenuState(MenuStatus.Labels);
    case MENU_NEW_LABEL:
      return { ...getMenuState(MenuStatus.NewLabel), name: action.name };
    case MENU_EDIT_LABEL:
      return { ...getMenuState(MenuStatus.EditLabel), tag: action.tag };
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

  const [menuState, menuDispatch] = useReducer(reducer, initialMenuState);

  const onNewTag = useCallback(
    (name) => {
      menuDispatch({ type: 'NEW_LABEL', name });
    },
    [menuDispatch]
  );

  const onEditTag = useCallback(
    (tag) => {
      menuDispatch({ type: 'EDIT_LABEL', tag });
    },
    [menuDispatch]
  );

  const onPrev = useCallback(
    (type?: 'add' | 'edit' | 'delete' | undefined) => {
      if (type === 'delete') {
        setValue(
          'tags',
          getValues('tags').filter((id) => !!tags.find((t) => t.tag_id === id)),
          { shouldValidate: true }
        );
      }

      menuDispatch({ type: 'PREV' });
    },
    [getValues, setValue, tags]
  );

  const closeFn = useCallback(() => {
    setIsOn(true);
    menuDispatch({ type: 'LABELS' });
  }, [setIsOn]);

  const openFn = useCallback(() => setIsOn(false), [setIsOn]);

  const buttonRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const {
    ref: menuRef,
    isOpened: isOpenedMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useSwitchElement<HTMLDivElement>(undefined, closeFn, openFn);

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
          <DdMenu ref={menuRef} targetRef={buttonRef} hidden={!isOpenedMenu}>
            <DdMenuHeader>
              {menuState.isPrev && (
                <DdMenuHeaderButton left={true} onClick={() => onPrev()}>
                  <RiArrowLeftSLine />
                </DdMenuHeaderButton>
              )}
              {menuState.status}
              <DdMenuHeaderButton onClick={onCloseMenu}>
                <RiCloseLine />
              </DdMenuHeaderButton>
            </DdMenuHeader>
            {menuState.isLabels && (
              <DdMenuItems>
                <TagList
                  boardId={boardId}
                  onSelect={onSelect}
                  selected={getValues('tags')}
                  onNewTag={onNewTag}
                  onEditTag={onEditTag}
                />
              </DdMenuItems>
            )}
            {menuState.isNewLabel && (
              <DdMenuItems>
                <AddTag boardId={boardId} name={menuState.name} callback={() => onPrev('add')} />
              </DdMenuItems>
            )}
            {menuState.isEditLabel && (
              <DdMenuItems>
                <EditTag tag={menuState.tag!} callback={onPrev} />
              </DdMenuItems>
            )}
          </DdMenu>
        </>
      </SwitchFormFooter>
    </form>
  );
};
