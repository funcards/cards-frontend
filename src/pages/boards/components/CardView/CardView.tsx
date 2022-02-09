import React from 'react';
import { Dialog } from '@reach/dialog';

import { Card } from '@/types';
import { ButtonClose } from '@/components';

import styles from './CardView.module.scss';

export interface CardViewProps {
  card: Card;
  showCard: boolean;
  onClose: () => void;
}

export const CardView: React.FC<CardViewProps> = ({ showCard, card, onClose }) => {
  return (
    <Dialog isOpen={showCard} onDismiss={onClose} className={styles.viewCard} aria-labelledby="card-view">
      <div className={styles.viewCard__wrapper}>
        <div className={styles.viewCard__cover} />
        <div className={styles.viewCard__header}>
          {card.name}
          <ButtonClose onClick={onClose} />
        </div>
        <div className={styles.viewCard__body}>
          <div className={styles.viewCard__main} />
          <div className={styles.viewCard__sidebar} />
        </div>
      </div>
    </Dialog>
  );
};
