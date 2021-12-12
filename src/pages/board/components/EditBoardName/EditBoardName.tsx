import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import * as classes from './EditBoardName.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { Board, BoardStateStatus } from '~src/store/board/board.types'
import { Button, TextField } from '~src/ui-kit'
import { editBoard } from '~src/store/board/board.slice'
import { useSwitchElement } from '~src/utils/hooks'

export interface EditBoardNameProps {
  board: Board
}

const schema = yup.string().trim().required().max(150, 'Name is too long')

export const EditBoardName: React.FC<EditBoardNameProps> = ({ board }) => {
  const { status } = useTypedSelector(selectBoardState)
  const [isValid, setIsValid] = useState(true)
  const [style, setStyle] = useState({ width: '0px' })
  const [boardName, setBoardName] = useState(board.name)
  const dispatch = useAppDispatch()
  const isLoading = useMemo(() => BoardStateStatus.EditBoard === status, [status])
  const spanRef: React.MutableRefObject<HTMLSpanElement | null> = useRef<HTMLSpanElement>(null)
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents } = useSwitchElement<HTMLDivElement>()

  const onSave = useCallback(
    (name: string) => {
      if (!schema.isValidSync(name) || name === board.name) {
        return
      }

      dispatch(editBoard({ board_id: board.board_id, name }))
    },
    [board.board_id, board.name, dispatch]
  )

  const onChange = (e: any) => {
    setBoardName(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setStyle({
      width: `${spanRef.current?.offsetWidth ?? 0}px`,
    })
    setIsValid(schema.isValidSync(boardName))
  }, [boardName])

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
        setBoardName(board.name)
      } else if (board.name !== boardName) {
        onSave(boardName)
      }
    }
  }, [board.name, isOpened, isValid, onSave, registerEvents, unregisterEvents])  // eslint-disable-line

  return (
    <div ref={ref}>
      <Button
        onClick={onOpen}
        className={
          isOpened ? `${classes.editBoardName__btn} ${classes.editBoardName__btn_opened}` : classes.editBoardName__btn
        }
        light={true}
        text={{ children: board.name }}
        spinner={isLoading}
      />
      <span ref={spanRef} className={classes.editBoardName__helper}>
        {boardName}
      </span>
      <form
        onSubmit={onSubmit}
        className={
          isOpened
            ? `${classes.editBoardName__form} ${classes.editBoardName__form_opened}`
            : classes.editBoardName__form
        }
      >
        <TextField
          error={!isValid}
          readOnly={isLoading}
          ref={inputRef}
          value={boardName}
          onChange={onChange}
          style={style}
          className={classes.editBoardName__input}
        />
      </form>
    </div>
  )
}
