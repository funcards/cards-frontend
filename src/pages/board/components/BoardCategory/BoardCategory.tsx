import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Menu, MenuButton, MenuItem, MenuLink, MenuPopover, MenuItems } from '@reach/menu-button'
import { TiTimes, TiChevronLeft } from 'react-icons/ti'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import { useTypedSelector } from '~src/store'
import { Category } from '~src/store/board/board.types'
import { selectCategoryCards } from '~src/store/board/board.selectors'
import { DndType } from '~src/store/types'
import { AddCard, BoardCard, CategoryName } from '~src/pages/board/components'
import { Button } from '~src/ui-kit'

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
  const [prependAddCard, setPrependAddCard] = useState(false)
  const onPrependAddCard = useCallback(() => setPrependAddCard(true), [])
  const onAppendAddCard = useCallback(() => setPrependAddCard(false), [])

  const labelAddCard = useMemo(() => (cards.length > 0 ? 'Add another card' : 'Add a card'), [cards.length])
  const position = useMemo(() => {
    const p = cards.map((c) => c.position)

    return p.length === 0 ? 0 : prependAddCard ? Math.min(...p) - 1 : Math.max(...p) + 1
  }, [prependAddCard, cards])

  const [showMoveList, setShowMoveList] = useState(false)
  const labelMenu = useMemo(() => (showMoveList ? 'Move list' : 'List actions'), [showMoveList])
  const onToggleMoveList = useCallback(
    (e) => {
      e.preventDefault()
      setShowMoveList(!showMoveList)
    },
    [showMoveList]
  )
  const onClear = useCallback(() => setShowMoveList(false), [])

  const ref: React.MutableRefObject<HTMLButtonElement | null> = useRef(null)
  const onClose = useCallback(() => ref.current?.focus(), [ref])

  const addCard = useMemo(
    () => (
      <div className={classes.category__addCard}>
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
  )

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
              <Menu>
                <MenuButton className={classes.menu__btn} ref={ref} onMouseDown={onClear} onKeyDown={onClear}>
                  <IoEllipsisHorizontalOutline className={classes.menu__icon} />
                </MenuButton>
                <MenuPopover className={classes.menu__list}>
                  <div className={classes.menu__header}>
                    {showMoveList && (
                      <Button className={classes.menu__prev} close={true} onClick={onToggleMoveList}>
                        <TiChevronLeft />
                      </Button>
                    )}
                    {labelMenu}
                    <Button className={classes.menu__close} close={true} onClick={onClose}>
                      <TiTimes />
                    </Button>
                  </div>
                  {showMoveList ? (
                    <div>TODO: Move list</div>
                  ) : (
                    <MenuItems className={classes.menu__group}>
                      <MenuItem className={classes.menu__item} onSelect={onPrependAddCard}>
                        Add card...
                      </MenuItem>
                      <MenuLink as="div" className={classes.menu__item} onClick={onToggleMoveList}>
                        Move list...
                      </MenuLink>
                    </MenuItems>
                  )}
                </MenuPopover>
              </Menu>
            </div>
            {prependAddCard && addCard}
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
            {!prependAddCard && addCard}
          </div>
        </div>
      )}
    </Draggable>
  )
}
