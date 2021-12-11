import React, { useCallback, useMemo } from 'react'
import { TiPlus } from 'react-icons/ti'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import * as classes from './AddCategory.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { BoardStateStatus, DraftCategory } from '~src/store/board/board.types'
import { newCategory } from '~src/store/board/board.slice'
import { TextField } from '~src/ui-kit'
import { useClickOutsideForm } from '~src/utils/hooks'
import { SwitchFormFooter } from '~src/pages/board/components'

export interface AddCategoryProps {
  boardId: string
  boardColor: string
  position: number
}

const schema = yup
  .object({
    name: yup.string().trim().required().max(150),
  })
  .required()

export const AddCategory: React.FC<AddCategoryProps> = ({ boardId, boardColor, position }) => {
  const dispatch = useAppDispatch()
  const { status } = useTypedSelector(selectBoardState)
  const isLoading = useMemo(() => BoardStateStatus.NewCategory === status, [status])

  const {
    isOpened,
    open: onOpen,
    close: onClose,
    ref,
    register,
    handleSubmit,
    setFocus,
    formState: { isDirty, isValid },
    reset,
  } = useClickOutsideForm<DraftCategory>({
    resetOnClose: true,
    focusOnOpen: 'name',
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { board_id: boardId, position },
  })

  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = useCallback(
    (data: DraftCategory) => {
      dispatch(newCategory(data))
      reset()
      setFocus('name')
    },
    [dispatch, reset, setFocus]
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      className={isOpened ? `${classes.addCategory} ${classes.addCategory_open}` : classes.addCategory}
    >
      <button
        onClick={onOpen}
        className={
          isOpened
            ? `${classes.addCategory__openBtn} ${classes.addCategory__openBtn_open}`
            : classes.addCategory__openBtn
        }
      >
        <TiPlus className={classes.addCategory__plusIcon} />
        Add another list
      </button>
      <TextField
        type="text"
        autoComplete="off"
        placeholder="Enter list title..."
        data-theme={boardColor}
        className={
          isOpened ? `${classes.addCategory__input} ${classes.addCategory__input_open}` : classes.addCategory__input
        }
        {...register('name')}
      />
      <SwitchFormFooter
        isOpened={isOpened}
        isLoading={isLoading}
        isDisabled={isDisabled}
        boardColor={boardColor}
        label="Add list"
        onClose={onClose}
      />
    </form>
  )
}
