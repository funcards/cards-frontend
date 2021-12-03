import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import * as classes from './NotFound.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { routes } from '~src/utils/constants'
import { selectAuthState } from '~src/modules/auth/auth.selectors'
import { signOut } from '~src/modules/auth/auth.slice'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentUser } = useTypedSelector(selectAuthState)

  const onSignOut = useCallback(() => {
    dispatch(signOut())
    navigate(routes.auth.signIn)
  }, [dispatch, navigate])

  return (
    <main className={classes.notFound}>
      <PageTitle title="Not Found" />
      <div className={classes.notFound__container}>
        <h1 className={classes.notFound__title}>Board not found.</h1>
        <p className={classes.notFound__text}>
          This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
        </p>
        {currentUser && (
          <div className={classes.notFound__auth}>
            <div>
              Not <strong className={classes.notFound__user}>{currentUser.name}</strong>?
            </div>
            <button className={classes.notFound__btn} onClick={onSignOut}>
              Switch accounts
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default NotFound
