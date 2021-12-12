import React, { useCallback, useEffect, useMemo } from 'react'
import { TiPlus } from 'react-icons/ti'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import * as classes from './AddCard.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { BoardStateStatus, DraftCard } from '~src/store/board/board.types'
import { newCard } from '~src/store/board/board.slice'
import { SwitchFormFooter } from '~src/pages/board/components'
import { TextField } from '~src/ui-kit'
import { useSwitchElement } from '~src/utils/hooks'

export interface AddCardProps {
  label: string
  boardId: string
  categoryId: string
  position: number
  boardColor: string
}

const schema = yup.object({
  name: yup.string().trim().required().max(255),
})

export const AddCard: React.FC<AddCardProps> = ({ label, boardId, categoryId, position, boardColor }) => {
  const dispatch = useAppDispatch()
  const { status } = useTypedSelector(selectBoardState)
  const isLoading = useMemo(() => BoardStateStatus.NewCard === status, [status])
  const { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents } = useSwitchElement<HTMLFormElement>()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm<DraftCard>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { board_id: boardId, category_id: categoryId, position },
  })

  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = useCallback(
    (data: DraftCard) => {
      dispatch(newCard(data))
      reset()
      setFocus('name')
    },
    [dispatch, reset, setFocus]
  )

  useEffect(() => {
    unregisterEvents()

    if (isOpened) {
      registerEvents()
      setFocus('name')
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
        onClose={onClose}
      />
    </form>
  )
}
