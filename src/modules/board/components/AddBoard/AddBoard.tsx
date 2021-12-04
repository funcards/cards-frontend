import React, { useMemo, useCallback, useRef, MutableRefObject } from 'react'
import { Dialog } from '@reach/dialog'
import { useForm, Controller } from 'react-hook-form'

import * as classes from './AddBoard.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardSate } from '~src/modules/board/board.selectors'
import { Theme } from '~src/modules/common/common.types'
import { BoardStateStatus, DraftBoard } from '~src/modules/board/board.types'
import { closeNewBoard, newBoard } from '~src/modules/board/board.slice'
import { selectAuthState } from '~src/modules/auth/auth.selectors'

const AddBoard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const { newBoardIsOpen, status } = useTypedSelector(selectBoardSate)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<DraftBoard>({ mode: 'onChange', defaultValues: { color: Theme.Sky } })

  const nameRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const { ref, ...rest } = register('name', {
    required: 'required',
    maxLength: 150,
  })

  const isLoading = useMemo(() => BoardStateStatus.NewBoard === status, [status])
  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])
  const onSubmit = useCallback((data) => dispatch(newBoard(data)), [dispatch])
  const onDismiss = useCallback(() => dispatch(closeNewBoard()), [dispatch])

  if (!isAuthenticated) {
    return <></>
  }

  return (
    <Dialog isOpen={newBoardIsOpen} initialFocusRef={nameRef} aria-labelledby="add-board" className={classes.addBoard}>
      <h2 className={classes.addBoard__title}>
        Create board
        <button className={classes.addBoard__close} onClick={onDismiss}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classes.addBoard__xIcon}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form__row">
          <Controller
            name="color"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className={classes.addBoard__themes}>
                {Object.values(Theme).map((t) => (
                  <div
                    key={t}
                    data-theme={t}
                    className={
                      t === field.value
                        ? `${classes.addBoard__theme} ${classes.addBoard__theme_active}`
                        : classes.addBoard__theme
                    }
                    onClick={() => field.onChange(t)}
                  >
                    &nbsp;
                  </div>
                ))}
              </div>
            )}
          />
        </div>
        <div className="form__row">
          <input
            type="text"
            placeholder="Add board title"
            className={errors.name ? 'form__input form__input_error' : 'form__input'}
            {...rest}
            ref={(e) => {
              ref(e)
              nameRef.current = e
            }}
          />
          {errors.name && <strong className="form__error">{errors.name.message}</strong>}
        </div>
        <div className="form__row">
          <textarea
            placeholder="Description"
            className={errors.description ? 'form__input form__input_error' : 'form__input'}
            {...register('description', {
              maxLength: 1000,
            })}
          />
          {errors.description && <strong className="form__error">{errors.description.message}</strong>}
        </div>
        <div className="form__row">
          <button type="submit" className="form__btn form__btn_end" disabled={disabled}>
            {isLoading && <span role="loading" />}
            Create board
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export default AddBoard
