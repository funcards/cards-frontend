import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { RiMoreFill, RiCloseLine } from 'react-icons/ri';

import { Category, DndType } from '@/types';
import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { deleteCategory, selectCategories, selectCategoryCards } from '@/store';
import { DdMenu, DdMenuItems, DdMenuHeader, DdMenuHeaderButton, DdMenuItem, ConfirmDelete } from '@/components';

import { AddCard, BoardCard, CategoryName } from '..';

import styles from './BoardCategory.module.scss';

export interface BoardCategoryProps {
  category: Category;
  boardColor: string;
  index: number;
}

export const BoardCategory: React.FC<BoardCategoryProps> = ({ category, boardColor, index }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectCategories);
  const cards = useAppSelector((state) =>
    selectCategoryCards(state, { board_id: category.board_id, category_id: category.category_id })
  );

  const [prependAddCard, setPrependAddCard] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [remove, setRemove] = useState(false);

  const deleteMessage = useMemo(
    () => `Are you sure you want to delete "${category.name} list"? This action is permanent.`,
    [category.name]
  );

  const labelAddCard = useMemo(() => (cards.length > 0 ? 'Add another card' : 'Add a card'), [cards.length]);
  const position = useMemo(() => {
    const p = cards.map((c) => c.position);

    return p.length === 0 ? 0 : prependAddCard ? Math.min(...p) - 1 : Math.max(...p) + 1;
  }, [prependAddCard, cards]);

  const buttonRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const { ref: menuRef, isOpened, onOpen, onClose } = useSwitchElement<HTMLDivElement>();

  const onPrependAddCard = useCallback(() => {
    onClose();
    setPrependAddCard(true);
  }, [onClose]);

  const onAppendAddCard = useCallback(() => setPrependAddCard(false), []);
  const onShowDialog = useCallback(() => setShowDialog(true), []);
  const onHideDialog = useCallback(() => setShowDialog(false), []);

  const onDelete = useCallback(() => {
    dispatch(deleteCategory({ board_id: category.board_id, category_id: category.category_id }));
    setRemove(true);
  }, [category.board_id, category.category_id, dispatch]);

  const addCard = useMemo(
    () => (
      <div className={styles.category__addCard}>
        <AddCard
          label={labelAddCard}
          boardId={category.board_id}
          categoryId={category.category_id}
          position={position}
          boardColor={boardColor}
          prependAddCard={prependAddCard}
          onClose={onAppendAddCard}
        />
      </div>
    ),
    [boardColor, category.board_id, category.category_id, labelAddCard, onAppendAddCard, position, prependAddCard]
  );

  useEffect(() => {
    if (!isLoading && remove) {
      setRemove(false);
      onHideDialog();
    }
  }, [isLoading, onHideDialog, remove]);

  return (
    <Draggable draggableId={category.category_id} index={index}>
      {(provided) => (
        <div
          className={styles.category}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role=""
        >
          <div className={styles.category__container}>
            <div className={styles.category__header}>
              <CategoryName boardId={category.board_id} categoryId={category.category_id} name={category.name} />
              <button ref={buttonRef} className={styles.category__menuBtn} onClick={onOpen}>
                <RiMoreFill />
              </button>
              <DdMenu ref={menuRef} targetRef={buttonRef} hidden={!isOpened}>
                <DdMenuHeader>
                  List actions
                  <DdMenuHeaderButton onClick={onClose}>
                    <RiCloseLine />
                  </DdMenuHeaderButton>
                </DdMenuHeader>
                <DdMenuItems>
                  <DdMenuItem onClick={onPrependAddCard}>Add card...</DdMenuItem>
                  <DdMenuItem onClick={onShowDialog}>Delete list...</DdMenuItem>
                  {showDialog && <ConfirmDelete message={deleteMessage} onClose={onHideDialog} onDelete={onDelete} />}
                </DdMenuItems>
              </DdMenu>
            </div>
            {prependAddCard && addCard}
            <Droppable droppableId={category.category_id} type={DndType.Card}>
              {(provided) => (
                <div className={styles.category__body} ref={provided.innerRef} {...provided.droppableProps}>
                  <div className={styles.category__cards}>
                    {cards.map((card, index) => (
                      <BoardCard key={card.card_id} card={card} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            {!prependAddCard && addCard}
          </div>
        </div>
      )}
    </Draggable>
  );
};
