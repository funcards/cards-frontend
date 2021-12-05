import React, { useMemo } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import * as classes from './BoardCategory.module.scss'

import { Category } from '~src/modules/board/board.types'
import { DndType } from '~src/modules/common/common.types'
import { BoardCard } from '~src/modules/board/components/BoardCard/BoardCard'
import { useTypedSelector } from '~src/store'
import { selectCategoryCards } from '~src/modules/board/board.selectors'

export interface BoardCategoryProps {
  category: Category
  boardColor: string
  index: number
}

export const BoardCategory: React.FC<BoardCategoryProps> = ({ category, boardColor, index }) => {
  const cards = useTypedSelector((state) =>
    selectCategoryCards(state, { boardId: category.board_id, categoryId: category.category_id })
  )
  const label = useMemo(() => (cards.ids.length > 0 ? 'Add another card' : 'Add a card'), [cards])
  const position = useMemo(() => {
    const length = cards.ids.length

    return length > 0 ? cards.items[cards.ids[length - 1]].position + 1 : 0
  }, [cards])

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
                  {cards.ids.length > 0 && (
                    <div className="category__cards">
                      {cards.ids.map((id, index) => (
                        <BoardCard key={id} card={cards.items[id]} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </div>
              )}
            </Droppable>
            {/*<div className="category__add-card">*/}
            {/*  <AddCard categoryId={category.id} label={label} position={position} color={color} />*/}
            {/*</div>*/}
          </div>
        </div>
      )}
    </Draggable>
  )
}
