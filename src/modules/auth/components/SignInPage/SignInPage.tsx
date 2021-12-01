import React from 'react'
import { Link } from 'react-router-dom'

import { AuthPage } from '../AuthPage/AuthPage'
import * as classes from '../AuthPage/AuthPage.module.scss'

import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { appName, routes, validation } from '~src/utils/constants'
import { SignIn } from '~src/modules/auth/auth.types'
import { useSignInMutation } from '~src/modules/auth/auth.api'

const SignInPage: React.FC = () => {
  const [signIn, { isLoading }] = useSignInMutation()

  const onSignIn = async (data: Record<string, any>) => await signIn(data as SignIn)

  return (
    <>
      <PageTitle title="Sign in" />
      <AuthPage
        title={`Sign in to ${appName.long}`}
        loading={isLoading}
        btnLabel="Sign in"
        onFormSubmit={onSignIn}
        formFields={{
          email: {
            type: 'email',
            placeholder: 'Enter email',
            registerOptions: {
              required: 'required',
              pattern: {
                value: validation.email,
                message: 'email is not valid.',
              },
            },
          },
          password: {
            type: 'password',
            placeholder: 'Enter password',
            registerOptions: {
              required: 'required',
              pattern: {
                value: validation.password,
                message: 'password is not valid.',
              },
            },
          },
        }}
        footer={
          <>
            <Link className={classes.auth__link} to={routes.auth.forgotPassword}>
              Can&apos;t log in?
            </Link>
            <span className={classes.auth__dot} />
            <Link className={classes.auth__link} to={routes.auth.signUp}>
              Sign up for an account
            </Link>
          </>
        }
      />
    </>
  )
}

export default SignInPage
