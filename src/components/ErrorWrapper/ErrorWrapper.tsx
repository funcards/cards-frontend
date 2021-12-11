import React, { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import * as classes from './ErrorWrapper.module.scss'

import { PageTitle } from '~src/components'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { signOut } from '~src/store/auth/auth.slice'
import { routes } from '~src/utils/constants'

export type ErrorWrapperProps = {
  pageTitle?: string | undefined
  errorTitle?: string | undefined
  errorMessage?: string | undefined
}

export const ErrorWrapper: React.FC<ErrorWrapperProps> = ({ pageTitle, errorTitle, errorMessage }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentUser } = useTypedSelector(selectAuthState)
  const title = useMemo(() => pageTitle ?? errorTitle, [errorTitle, pageTitle])

  const onSignOut = useCallback(() => {
    dispatch(signOut())
    navigate(routes.auth.signIn)
  }, [dispatch, navigate])

  return (
    <main className={classes.errorWrapper}>
      {title && <PageTitle title={title} />}
      <div className={classes.errorWrapper__container}>
        {errorTitle && <h1 className={classes.errorWrapper__title}>{errorTitle}</h1>}
        {errorMessage && <p className={classes.errorWrapper__message}>{errorMessage}</p>}
        {currentUser && (
          <div className={classes.errorWrapper__auth}>
            <div>
              Not <strong className={classes.errorWrapper__user}>{currentUser.name}</strong>?
            </div>
            <button className={classes.errorWrapper__btn} onClick={onSignOut}>
              Switch accounts
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
