import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { TiTimes, TiPlus } from 'react-icons/ti'

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
    <form onSubmit={handleSubmit(onSubmit)} ref={ref} className={isOpen ? 'add-card add-card_open' : 'add-card'}>
      <button onClick={open} className={isOpen ? 'add-card__open-btn add-card__open-btn_open' : 'add-card__open-btn'}>
        <TiPlus className="add-card__plus-icon" />
        {label}
      </button>
      <textarea
        className={isOpen ? 'add-card__input add-card__input_open' : 'add-card__input'}
        placeholder="Enter a title for this card..."
        {...register('name', {
          required: 'required',
          maxLength: 255,
        })}
      />
      <div className={isOpen ? 'add-card__footer add-card__footer_open' : 'add-card__footer'}>
        <button type="submit" className="add-card__add-btn" disabled={disabled} data-theme={boardColor}>
          {isLoading && <span role="loading" />}
          Add card
        </button>
        <button className="add-card__close-btn" onClick={close}>
          <TiTimes className="add-card__x-icon" />
        </button>
      </div>
    </form>
  )
}
