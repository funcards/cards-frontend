import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

import * as classes from './BoardCard.module.scss'

import { Card } from '~src/modules/board/board.types'

export interface BoardCardProps {
  card: Card
  index: number
}

export const BoardCard: React.FC<BoardCardProps> = ({ card, index }) => (
  <Draggable draggableId={card.card_id} index={index}>
    {(provided) => (
      <div
        className={classes.card}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        role=""
      >
        <div className={classes.card__name}>{card.name}</div>
      </div>
    )}
  </Draggable>
)
