import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import * as classes from './CategoryName.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { BoardStateStatus } from '~src/store/board/board.types'
import { useSwitchElement } from '~src/utils/hooks'
import { TextField } from '~src/ui-kit'
import { editCategory } from '~src/store/board/board.slice'

export interface CategoryNameProps {
  boardId: string
  categoryId: string
  categoryName: string
}

const schema = yup.string().trim().required().max(150, 'Name is too long')

export const CategoryName: React.FC<CategoryNameProps> = ({ boardId, categoryId, categoryName }) => {
  const { status } = useTypedSelector(selectBoardState)
  const [isValid, setIsValid] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState(categoryName)
  const dispatch = useAppDispatch()
  const isLoading = useMemo(() => BoardStateStatus.EditCategory === status, [status])
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents } = useSwitchElement<HTMLFormElement>()

  const onSave = useCallback(
    (name: string) => {
      if (!schema.isValidSync(name) || name === categoryName) {
        return
      }

      dispatch(editCategory({ board_id: boardId, category_id: categoryId, name }))
    },
    [categoryId, categoryName, dispatch]
  )

  const onChange = (e: any) => {
    setNewCategoryName(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setIsValid(schema.isValidSync(newCategoryName))
  }, [newCategoryName])

  useEffect(() => {
    unregisterEvents()

    if (isOpened) {
      registerEvents()

      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    } else {
      if (!isValid) {
        setNewCategoryName(categoryName)
      } else if (categoryName !== newCategoryName) {
        onSave(newCategoryName)
      }
    }
  }, [categoryName, isOpened, isValid, onSave, registerEvents, unregisterEvents])  // eslint-disable-line

  return (
    <form ref={ref} className={classes.categoryName} onSubmit={onSubmit}>
      <h2
        className={
          isOpened ? `${classes.categoryName__name} ${classes.categoryName__name_opened}` : classes.categoryName__name
        }
        onClick={onOpen}
      >
        {categoryName}
      </h2>
      <TextField
        error={!isValid}
        readOnly={isLoading}
        ref={inputRef}
        value={newCategoryName}
        onChange={onChange}
        className={
          isOpened
            ? `${classes.categoryName__input} ${classes.categoryName__input_opened}`
            : classes.categoryName__input
        }
      />
    </form>
  )
}
