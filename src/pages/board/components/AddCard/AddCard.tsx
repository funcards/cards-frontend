import React, { useCallback, useEffect, useMemo } from 'react'
import { TiPlus } from 'react-icons/ti'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { BoardStateStatus } from '~src/store/board/board.types'
import { newCard } from '~src/store/board/board.slice'
import { SwitchFormFooter } from '~src/pages/board/components'
import { TextField } from '~src/ui-kit'
import { useSwitchElement } from '~src/utils/hooks'

import * as classes from './AddCard.module.scss'

export interface AddCardProps {
  label: string
  boardId: string
  categoryId: string
  position: number
  boardColor: string
  prependAddCard?: boolean | undefined
  onClose?: () => void
}

const schema = yup.object({
  name: yup.string().trim().required().max(255),
})

export const AddCard: React.FC<AddCardProps> = ({
  label,
  boardId,
  categoryId,
  position,
  boardColor,
  prependAddCard,
  onClose,
}) => {
  const dispatch = useAppDispatch()

  const { status } = useTypedSelector(selectBoardState)

  const {
    ref,
    isOpened,
    onOpen,
    onClose: onCloseFn,
    registerEvents,
    unregisterEvents,
  } = useSwitchElement<HTMLFormElement>(prependAddCard, onClose)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const isLoading = useMemo(() => BoardStateStatus.NewCard === status, [status])
  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = useCallback(
    (data) => {
      dispatch(newCard({ board_id: boardId, category_id: categoryId, position, tags: [], name: data.name }))
      reset()
      setFocus('name')
    },
    [dispatch, reset, setFocus, boardId, categoryId, position]
  )

  useEffect(() => {
    if (isOpened) {
      registerEvents()
      setFocus('name')

      return () => {
        unregisterEvents()
      }
    } else {
      reset()
    }
  }, [isOpened, setFocus, reset, unregisterEvents, registerEvents])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      className={isOpened ? `${classes.addCard} ${classes.addCard_open}` : classes.addCard}
    >
      <button
        onClick={onOpen}
        className={isOpened ? `${classes.addCard__openBtn} ${classes.addCard__openBtn_open}` : classes.addCard__openBtn}
      >
        <TiPlus className={classes.addCard__plusIcon} />
        {label}
      </button>
      <TextField
        placeholder="Enter a title for this card..."
        multiLine={true}
        className={isOpened ? `${classes.addCard__input} ${classes.addCard__input_open}` : classes.addCard__input}
        {...register('name')}
      />
      <SwitchFormFooter
        isOpened={isOpened}
        isLoading={isLoading}
        isDisabled={isDisabled}
        boardColor={boardColor}
        label="Add card"
        onClose={onCloseFn}
      />
    </form>
  )
}
