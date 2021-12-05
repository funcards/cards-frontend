import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { TiTimes, TiPlus } from 'react-icons/ti'

import * as classes from './AddCategory.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { BoardStateStatus, DraftCategory } from '~src/modules/board/board.types'
import { newCategory } from '~src/modules/board/board.slice'
import { selectBoardSate } from '~src/modules/board/board.selectors'

export interface AddCategoryProps {
  boardId: string
  boardColor: string
  position: number
}

export const AddCategory: React.FC<AddCategoryProps> = ({ boardId, boardColor, position }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { status } = useTypedSelector(selectBoardSate)
  const isLoading = useMemo(() => BoardStateStatus.NewCategory === status, [status])

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useForm<DraftCategory>({ mode: 'onChange', defaultValues: { board_id: boardId, position } })

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = (data: DraftCategory) => {
    dispatch(newCategory(data))
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
      className={isOpen ? `${classes.addCategory} ${classes.addCategory_open}` : classes.addCategory}
    >
      <button
        onClick={open}
        className={
          isOpen ? `${classes.addCategory__openBtn} ${classes.addCategory__openBtn_open}` : classes.addCategory__openBtn
        }
      >
        <TiPlus className={classes.addCategory__plusIcon} />
        Add another list
      </button>
      <input
        type="text"
        autoComplete="off"
        data-theme={boardColor}
        className={
          isOpen ? `${classes.addCategory__input} ${classes.addCategory__input_open}` : classes.addCategory__input
        }
        placeholder="Enter list title..."
        {...register('name', {
          required: 'required',
          maxLength: 150,
        })}
      />
      <div
        className={
          isOpen ? `${classes.addCategory__footer} ${classes.addCategory__footer_open}` : classes.addCategory__footer
        }
      >
        <button type="submit" className={classes.addCategory__addBtn} disabled={disabled} data-theme={boardColor}>
          {isLoading && <span role="loading" />}
          Add list
        </button>
        <button className={classes.addCategory__closeBtn} onClick={close}>
          <TiTimes className={classes.addCategory__xIcon} />
        </button>
      </div>
    </form>
  )
}
