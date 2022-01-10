import React from 'react'
import { Dialog } from '@reach/dialog'
import { TiTimes } from 'react-icons/ti'

import { Card } from '~src/store/board/board.types'
import { Button } from '~src/ui-kit'

import * as classes from './CardView.module.scss'

export interface CardViewProps {
  card: Card
  showCard: boolean
  onClose: () => void
}

export const CardView: React.FC<CardViewProps> = ({ showCard, card, onClose }) => {
  return (
    <Dialog isOpen={showCard} onDismiss={onClose} className={classes.viewCard} aria-labelledby="card-view">
      <div className={classes.viewCard__wrapper}>
        <div className={classes.viewCard__cover} />
        <div className={classes.viewCard__header}>
          {card.name}
          <Button close={true} onClick={onClose}>
            <TiTimes />
          </Button>
        </div>
        <div className={classes.viewCard__body}>
          <div className={classes.viewCard__main} />
          <div className={classes.viewCard__sidebar} />
        </div>
      </div>
    </Dialog>
  )
}
