import React from 'react'
import { Dialog } from '@reach/dialog'

import * as classes from './CardView.module.scss'

import { Card } from '~src/store/board/board.types'

export interface CardViewProps {
  card: Card
  showCard: boolean
  onClose: () => void
}

export const CardView: React.FC<CardViewProps> = ({ showCard, card, onClose }) => {
  return (
    <Dialog isOpen={showCard} onDismiss={onClose} className={classes.viewCard}>
      <div className={classes.viewCard__wrapper}>
        <h2>{card.name}</h2>
      </div>
    </Dialog>
  )
}
