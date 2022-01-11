import React, { useCallback, useEffect, useMemo } from 'react'
import { TiPlus } from 'react-icons/ti'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { BoardStateStatus } from '~src/store/board/board.types'
import { newCategory } from '~src/store/board/board.slice'
import { TextField } from '~src/ui-kit'
import { useSwitchElement } from '~src/utils/hooks'
import { SwitchFormFooter } from '~src/pages/board/components'

import * as classes from './AddCategory.module.scss'

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
  const { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents } = useSwitchElement<HTMLFormElement>()

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

  const isDisabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  const onSubmit = useCallback(
    (data) => {
      dispatch(newCategory({ board_id: boardId, position, name: data.name }))
      reset()
      setFocus('name')
    },
    [dispatch, reset, setFocus, boardId, position]
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
