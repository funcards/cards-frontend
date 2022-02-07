import React, { useCallback, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Card, Theme } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectBoardTagsByIds, selectUi, toggleTagsLabel } from '@/store';
import { Button, Text } from '@/components';

import { CardView } from '../CardView/CardView';

import styles from './BoardCard.module.scss';

export interface BoardCardProps {
  card: Card;
  index: number;
}

export const BoardCard: React.FC<BoardCardProps> = ({ card, index }) => {
  const dispatch = useAppDispatch();
  const allTags = useAppSelector((state) =>
    selectBoardTagsByIds(state, { board_id: card.board_id, tags_id: card.tags })
  );
  const { tagsLabelIsOpened } = useAppSelector(selectUi);
  const [showCardView, setShowCardView] = useState(false);

  const onOpenCardView = useCallback(() => setShowCardView(true), []);
  const onCloseCardView = useCallback(() => setShowCardView(false), []);

  const tags = useMemo(() => allTags.filter((t) => t.color !== Theme.NoColor), [allTags]);

  const onToggleTagLabel = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(toggleTagsLabel());
    },
    [dispatch]
  );

  return (
    <Draggable draggableId={card.card_id} index={index}>
      {(provided) => (
        <div
          role=""
          ref={provided.innerRef}
          className={styles.card}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onOpenCardView}
        >
          {tags.length > 0 && (
            <div className={styles.card__tags}>
              {tags.map((tag, index) => (
                <Button
                  key={index}
                  type="button"
                  primary={true}
                  className={styles.card__tag}
                  data-theme={tag.color}
                  onClick={onToggleTagLabel}
                >
                  <Text
                    className={
                      tagsLabelIsOpened ? `${styles.card__label} ${styles.card__label_open}` : styles.card__label
                    }
                  >
                    {tag.name}
                  </Text>
                </Button>
              ))}
            </div>
          )}
          <div className={styles.card__name}>{card.name}</div>
          <CardView card={card} showCard={showCardView} onClose={onCloseCardView} />
        </div>
      )}
    </Draggable>
  );
};
