import React, { useCallback, useMemo, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from '@reach/dialog'
import { TiTimes } from 'react-icons/ti'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { selectBoardState } from '~src/store/board/board.selectors'
import { selectUiState } from '~src/store/ui/ui.selectors'
import { BoardStateStatus, DraftBoard } from '~src/store/board/board.types'
import { Theme } from '~src/store/types'
import { newBoard } from '~src/store/board/board.slice'
import { closeAddBoard } from '~src/store/ui/ui.slice'
import { Button, Form, FormRow, FormTextField } from '~src/ui-kit'
import { routes } from '~src/utils/constants'
import { newBoardSchema } from '~src/store/board/board.validation'

import * as classes from './AddBoard.module.scss'

export const AddBoard: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const { status } = useTypedSelector(selectBoardState)
  const { addBoardDialogIsOpened } = useTypedSelector(selectUiState)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<DraftBoard>({
    mode: 'onChange',
    resolver: yupResolver(newBoardSchema),
    defaultValues: { color: Theme.Sky },
  })

  const { ref, ...rest } = register('name')
  const nameRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)
  const isLoading = useMemo(() => BoardStateStatus.NewBoard === status, [status])
  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])
  const isRedirect = useMemo(
    () => !isAuthenticated && addBoardDialogIsOpened && !location.state,
    [addBoardDialogIsOpened, isAuthenticated, location.state]
  )

  const onSubmit = useCallback((data) => dispatch(newBoard(data)), [dispatch])
  const onDismiss = useCallback(() => dispatch(closeAddBoard()), [dispatch])

  if (isRedirect) {
    return <Navigate to={routes.auth.signIn} state={{ from: location }} />
  }

  if (!isAuthenticated) {
    return <></>
  }

  return (
    <Dialog
      isOpen={addBoardDialogIsOpened}
      initialFocusRef={nameRef}
      aria-labelledby="add-board"
      className={classes.addBoard}
    >
      <div className={classes.addBoard__wrapper}>
        <h2 className={classes.addBoard__title}>
          Create board
          <Button close={true} onClick={onDismiss}>
            <TiTimes />
          </Button>
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className={classes.addBoard__themes}>
                  {Object.values(Theme)
                    .filter((t) => t !== Theme.NoColor)
                    .map((t) => (
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
          </FormRow>
          <FormTextField
            placeholder="Add board title"
            error={errors.name}
            showError={true}
            row={true}
            ref={(e: HTMLInputElement | null) => {
              ref(e)
              nameRef.current = e
            }}
            {...rest}
          />
          <FormTextField
            placeholder="Description"
            error={errors.description}
            showError={true}
            multiLine={true}
            row={true}
            {...register('description')}
          />
          <FormRow>
            <Button type="submit" primary={true} end={true} disabled={disabled} spinner={isLoading}>
              Create board
            </Button>
          </FormRow>
        </Form>
      </div>
    </Dialog>
  )
}
