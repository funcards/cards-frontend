import React, { useCallback, useMemo, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { Card } from '~src/store/board/board.types'
import { Button, Text } from '~src/ui-kit'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectTags } from '~src/store/board/board.selectors'
import { toggleTagsLabel } from '~src/store/ui/ui.slice'
import { Theme } from '~src/store/types'
import { selectUiState } from '~src/store/ui/ui.selectors'

import { CardView } from '../CardView/CardView'

import * as classes from './BoardCard.module.scss'

export interface BoardCardProps {
  card: Card
  index: number
}

export const BoardCard: React.FC<BoardCardProps> = ({ card, index }) => {
  const dispatch = useAppDispatch()
  const allTags = useTypedSelector((state) => selectTags(state, { boardId: card.board_id, tagsId: card.tags }))
  const { tagsLabelIsOpened } = useTypedSelector(selectUiState)
  const [showCardView, setShowCardView] = useState(false)

  const onOpenCardView = useCallback(() => setShowCardView(true), [])
  const onCloseCardView = useCallback(() => setShowCardView(false), [])

  const tags = useMemo(() => allTags.filter((t) => t.color !== Theme.NoColor), [allTags])

  const onToggleTagLabel = useCallback(
    (e) => {
      e.stopPropagation()
      dispatch(toggleTagsLabel())
    },
    [dispatch]
  )

  return (
    <Draggable draggableId={card.card_id} index={index}>
      {(provided) => (
        <div
          role=""
          ref={provided.innerRef}
          className={classes.card}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onOpenCardView}
        >
          {tags.length > 0 && (
            <div className={classes.card__tags}>
              {tags.map((tag, index) => (
                <Button
                  key={index}
                  type="button"
                  primary={true}
                  className={classes.card__tag}
                  data-theme={tag.color}
                  onClick={onToggleTagLabel}
                >
                  <Text
                    className={
                      tagsLabelIsOpened ? `${classes.card__label} ${classes.card__label_open}` : classes.card__label
                    }
                  >
                    {tag.name}
                  </Text>
                </Button>
              ))}
            </div>
          )}
          <div className={classes.card__name}>{card.name}</div>
          <CardView card={card} showCard={showCardView} onClose={onCloseCardView} />
        </div>
      )}
    </Draggable>
  )
}
