import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { TiTimes, TiPlus } from 'react-icons/ti'

import * as classes from './AddCard.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardSate } from '~src/modules/board/board.selectors'
import { BoardStateStatus, DraftCard } from '~src/modules/board/board.types'
import { newCard } from '~src/modules/board/board.slice'

export interface AddCardProps {
  label: string
  boardId: string
  categoryId: string
  position: number
  boardColor: string
}

export const AddCard: React.FC<AddCardProps> = ({ label, boardId, categoryId, position, boardColor }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { status } = useTypedSelector(selectBoardSate)
  const isLoading = useMemo(() => BoardStateStatus.NewCard === status, [status])

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm<DraftCard>({ mode: 'onChange', defaultValues: { board_id: boardId, category_id: categoryId, position } })

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = (data: DraftCard) => {
    dispatch(newCard(data))
    reset()
    setFocus('name')
  }

  const open = () => {
    setIsOpen(true)
    setFocus('name')
  }

  const close = () => {
    reset()
    setIsOpen(false)
  }

  const ref = useDetectClickOutside({ onTriggered: close })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      className={isOpen ? `${classes.addCard} ${classes.addCard_open}` : classes.addCard}
    >
      <button
        onClick={open}
        className={isOpen ? `${classes.addCard__openBtn} ${classes.addCard__openBtn_open}` : classes.addCard__openBtn}
      >
        <TiPlus className={classes.addCard__plusIcon} />
        {label}
      </button>
      <textarea
        className={isOpen ? `${classes.addCard__input} ${classes.addCard__input_open}` : classes.addCard__input}
        placeholder="Enter a title for this card..."
        {...register('name', {
          required: 'required',
          maxLength: 255,
        })}
      />
      <div className={isOpen ? `${classes.addCard__footer} ${classes.addCard__footer_open}` : classes.addCard__footer}>
        <button type="submit" className={classes.addCard__addBtn} disabled={disabled} data-theme={boardColor}>
          {isLoading && <span role="loading" />}
          Add card
        </button>
        <button className={classes.addCard__closeBtn} onClick={close}>
          <TiTimes className={classes.addCard__xIcon} />
        </button>
      </div>
    </form>
  )
}
