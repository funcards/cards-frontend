import React, { useCallback, useMemo, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import { useTypedSelector } from '~src/store'
import { Category } from '~src/store/board/board.types'
import { selectCategoryCards } from '~src/store/board/board.selectors'
import { DndType } from '~src/store/types'
import { AddCard, BoardCard, CategoryName } from '~src/pages/board/components'

import * as classes from './BoardCategory.module.scss'

export interface BoardCategoryProps {
  category: Category
  boardColor: string
  index: number
}

export const BoardCategory: React.FC<BoardCategoryProps> = ({ category, boardColor, index }) => {
  const cards = useTypedSelector((state) =>
    selectCategoryCards(state, { boardId: category.board_id, categoryId: category.category_id })
  )

  const [appendCard, setAppendCard] = useState(true)
  const onAppendCard = useCallback(() => setAppendCard(true), [])
  const onPrependCard = useCallback(() => setAppendCard(false), [])

  const label = useMemo(() => (cards.length > 0 ? 'Add another card' : 'Add a card'), [cards.length])
  const position = useMemo(() => {
    const p = cards.map((c) => c.position)

    return p.length === 0 ? 0 : appendCard ? Math.max(...p) + 1 : Math.min(...p) - 1
  }, [appendCard, cards])

  return (
    <Draggable draggableId={category.category_id} index={index}>
      {(provided) => (
        <div
          className={classes.category}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role=""
        >
          <div className={classes.category__container}>
            <div className={classes.category__header}>
              <CategoryName
                boardId={category.board_id}
                categoryId={category.category_id}
                categoryName={category.name}
              />
              <button className={classes.category__menuBtn} onClick={onPrependCard}>
                <IoEllipsisHorizontalOutline className={classes.category__menuIcon} />
              </button>
            </div>
            {!appendCard && (
              <div className={classes.category__addCard}>
                <AddCard
                  label={label}
                  boardId={category.board_id}
                  categoryId={category.category_id}
                  position={position}
                  boardColor={boardColor}
                  openState={true}
                  onClose={onAppendCard}
                />
              </div>
            )}
            <Droppable droppableId={category.category_id} type={DndType.Card}>
              {(provided) => (
                <div className={classes.category__body} ref={provided.innerRef} {...provided.droppableProps}>
                  <div className={classes.category__cards}>
                    {cards.map((card, index) => (
                      <BoardCard key={card.card_id} card={card} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            {appendCard && (
              <div className={classes.category__addCard}>
                <AddCard
                  label={label}
                  boardId={category.board_id}
                  categoryId={category.category_id}
                  position={position}
                  boardColor={boardColor}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
