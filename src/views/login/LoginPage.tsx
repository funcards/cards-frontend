import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LoginForm } from './LoginForm'

import { login } from '~src/store/auth/auth.slice'
import { SignIn } from '~src/store/types'
import { getAuth } from '~src/store/selectors'
import { PageTitle } from '~src/components/helmet/PageTitle'
import { appName } from '~src/utils/constants'

const LoginPage: React.FC = () => {
  const { loading } = useSelector(getAuth)
  const dispatch = useDispatch()

  const onLogin = (data: SignIn) => {
    dispatch(login(data))
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
