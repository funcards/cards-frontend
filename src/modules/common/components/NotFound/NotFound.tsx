import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as classes from './NotFound.module.scss'

import { useAppDispatch, signOutFn, useTypedSelector } from '~src/store'
import { getMe } from '~src/modules/user/user.selectors'
import { useMeQuery } from '~src/modules/user/user.api'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { routes } from '~src/utils/constants'
import { getAuth } from '~src/modules/auth/auth.selectors'

const NotFound: React.FC = () => {
  const [skip, setSkip] = useState(true)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useTypedSelector(getAuth)
  const me = useTypedSelector(getMe)
  const { isLoading, isUninitialized } = useMeQuery(undefined, { skip })

  const onSignOut = async () => {
    await signOutFn(dispatch)
    await navigate(routes.auth.signIn)
  }

  useEffect(() => {
    if (isAuthenticated) {
      setSkip(false)
    }
  }, [isAuthenticated])

  return (
    <main className={classes.notFound}>
      <PageTitle title="Not Found" />
      <div className={classes.notFound__container}>
        <h1 className={classes.notFound__title}>Board not found.</h1>
        <p className={classes.notFound__text}>
          This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
        </p>
        {!isLoading && !isUninitialized && me && (
          <div className={classes.notFound__auth}>
            <div>
              Not <strong className={classes.notFound__user}>{me.name}</strong>?
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
