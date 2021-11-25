import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LoginForm } from '../LoginForm/LoginForm'

import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { appName } from '~src/utils/constants'
import { getAuth } from '~src/modules/auth/auth.selectors'
import { SignIn } from '~src/modules/auth/auth.types'
import { signIn } from '~src/modules/auth/auth.slice'

const LoginPage: React.FC = () => {
  const { loading } = useSelector(getAuth)
  const dispatch = useDispatch()

  const onLogin = (data: SignIn) => {
    dispatch(signIn(data))
  }

  return (
    <>
      <PageTitle title="Login" />
      <main className="page page-center">
        <div className="container-tight py-4">
          <div className="text-center mb-4">
            <h1>{appName.long}</h1>
          </div>
          <LoginForm loading={loading} onLogin={onLogin} />
        </div>
      </main>
    </>
  )
}

export default LoginPage
