import React, { useCallback, useMemo, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { TiTimes, TiChevronLeft } from 'react-icons/ti';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { Portal } from '@reach/portal';

import { Category, DndType } from '@/types';
import { useAppSelector, useDropdownMenu } from '@/hooks';
import { selectCategoryCards } from '@/store';
import { Button } from '@/components';

import { AddCard, BoardCard, CategoryName } from '..';

import styles from './BoardCategory.module.scss';

export interface BoardCategoryProps {
  category: Category;
  boardColor: string;
  index: number;
}

export const BoardCategory: React.FC<BoardCategoryProps> = ({ category, boardColor, index }) => {
  const cards = useAppSelector((state) =>
    selectCategoryCards(state, { board_id: category.board_id, category_id: category.category_id })
  );

  const [prependAddCard, setPrependAddCard] = useState(false);
  const [showMoveList, setShowMoveList] = useState(false);

  const labelAddCard = useMemo(() => (cards.length > 0 ? 'Add another card' : 'Add a card'), [cards.length]);
  const position = useMemo(() => {
    const p = cards.map((c) => c.position);

    return p.length === 0 ? 0 : prependAddCard ? Math.min(...p) - 1 : Math.max(...p) + 1;
  }, [prependAddCard, cards]);
  const labelMenu = useMemo(() => (showMoveList ? 'Move list' : 'List actions'), [showMoveList]);

  const onToggleMoveList = useCallback(
    (e) => {
      e.preventDefault();
      setShowMoveList(!showMoveList);
    },
    [showMoveList]
  );

  const closeFn = useCallback(() => {
    setShowMoveList(false);
  }, []);

  const { buttonRef, menuRef, menuStyle, onOpen, onClose } = useDropdownMenu({ closeFn });

  const onPrependAddCard = useCallback(() => {
    onClose();
    setPrependAddCard(true);
  }, [onClose]);

  const onAppendAddCard = useCallback(() => setPrependAddCard(false), []);

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
              <button ref={buttonRef} className={styles.menu__btn} onClick={onOpen}>
                <IoEllipsisHorizontalOutline className={styles.menu__icon} />
              </button>
              <Portal>
                <div ref={menuRef} style={menuStyle} className={styles.menu__list}>
                  <div className={styles.menu__header}>
                    {showMoveList && (
                      <Button className={styles.menu__prev} close={true} onClick={onToggleMoveList}>
                        <TiChevronLeft />
                      </Button>
                    )}
                    {labelMenu}
                    <Button className={styles.menu__close} close={true} onClick={onClose}>
                      <TiTimes />
                    </Button>
                  </div>
                  {showMoveList ? (
                    <div>TODO: Move list</div>
                  ) : (
                    <div className={styles.menu__group}>
                      <div className={styles.menu__item} onClick={onPrependAddCard}>
                        Add card...
                      </div>
                      <div className={styles.menu__item} onClick={onToggleMoveList}>
                        Move list...
                      </div>
                    </div>
                  )}
                </div>
              </Portal>
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