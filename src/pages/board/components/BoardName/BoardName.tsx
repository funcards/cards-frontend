import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import * as classes from './BoardName.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardState } from '~src/store/board/board.selectors'
import { Board, BoardStateStatus } from '~src/store/board/board.types'
import { Button, TextField } from '~src/ui-kit'
import { editBoard } from '~src/store/board/board.slice'
import { useSwitchElement } from '~src/utils/hooks'

export interface BoardNameProps {
  boardId: string
  boardName: string
}

const schema = yup.string().trim().required().max(150, 'Name is too long')

export const BoardName: React.FC<BoardNameProps> = ({ boardId, boardName }) => {
  const { status } = useTypedSelector(selectBoardState)
  const [isValid, setIsValid] = useState(true)
  const [style, setStyle] = useState({ width: '0px' })
  const [newBoardName, setNewBoardName] = useState(boardName)
  const dispatch = useAppDispatch()
  const isLoading = useMemo(() => BoardStateStatus.EditBoard === status, [status])
  const spanRef: React.MutableRefObject<HTMLSpanElement | null> = useRef<HTMLSpanElement>(null)
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents } = useSwitchElement<HTMLDivElement>()

  const onSave = useCallback(
    (name: string) => {
      if (!schema.isValidSync(name) || name === boardName) {
        return
      }

      dispatch(editBoard({ board_id: boardId, name }))
    },
    [boardId, boardName, dispatch]
  )

  const onChange = (e: any) => {
    setNewBoardName(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setStyle({
      width: `${spanRef.current?.offsetWidth ?? 0}px`,
    })
    setIsValid(schema.isValidSync(newBoardName))
  }, [newBoardName])

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
        setNewBoardName(boardName)
      } else if (boardName !== newBoardName) {
        onSave(newBoardName)
      }
    }
  }, [boardName, isOpened, isValid, onSave, registerEvents, unregisterEvents])  // eslint-disable-line

  return (
    <div ref={ref}>
      <Button
        onClick={onOpen}
        className={isOpened ? `${classes.boardName__btn} ${classes.boardName__btn_opened}` : classes.boardName__btn}
        light={true}
        text={{ children: boardName }}
        spinner={isLoading}
      />
      <span ref={spanRef} className={classes.boardName__helper}>
        {newBoardName}
      </span>
      <form
        onSubmit={onSubmit}
        className={isOpened ? `${classes.boardName__form} ${classes.boardName__form_opened}` : classes.boardName__form}
      >
        <TextField
          error={!isValid}
          readOnly={isLoading}
          ref={inputRef}
          value={newBoardName}
          onChange={onChange}
          style={style}
          className={classes.boardName__input}
        />
      </form>
    </div>
  )
}
