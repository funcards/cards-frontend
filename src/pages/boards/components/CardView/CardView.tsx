import React from 'react';
import { Dialog } from '@reach/dialog';
import { TiTimes } from 'react-icons/ti';

import { Card } from '@/types';
import { Button } from '@/components';

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
          <Button close={true} onClick={onClose}>
            <TiTimes />
          </Button>
        </div>
        <div className={styles.viewCard__body}>
          <div className={styles.viewCard__main} />
          <div className={styles.viewCard__sidebar} />
        </div>
      </div>
    </Dialog>
  );
};
