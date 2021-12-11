import React, { useMemo } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import * as classes from './BoardCategory.module.scss'

import { useTypedSelector } from '~src/store'
import { Category } from '~src/store/board/board.types'
import { selectCategoryCards } from '~src/store/board/board.selectors'
import { DndType } from '~src/store/types'
import { AddCard, BoardCard } from '~src/pages/board/components'

export interface BoardCategoryProps {
  category: Category
  boardColor: string
  index: number
}

export const BoardCategory: React.FC<BoardCategoryProps> = ({ category, boardColor, index }) => {
  const cards = useTypedSelector((state) =>
    selectCategoryCards(state, { boardId: category.board_id, categoryId: category.category_id })
  )
  const label = useMemo(() => (cards.length > 0 ? 'Add another card' : 'Add a card'), [cards])
  const position = useMemo(() => (cards.length > 0 ? cards[cards.length - 1].position + 1 : 0), [cards])

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
              <h2 className={classes.category__name}>{category.name}</h2>
              <button className={classes.category__menuBtn}>
                <IoEllipsisHorizontalOutline className={classes.category__menuIcon} />
              </button>
            </div>
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
            <div className={classes.category__addCard}>
              <AddCard
                label={label}
                boardId={category.board_id}
                categoryId={category.category_id}
                position={position}
                boardColor={boardColor}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
