import React from 'react'
import { Link } from 'react-router-dom'

import { AuthPage } from '../AuthPage/AuthPage'
import * as classes from '../AuthPage/AuthPage.module.scss'

import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { routes, validation } from '~src/utils/constants'
import { SignUp } from '~src/modules/auth/auth.types'
import { useSignUpMutation } from '~src/modules/auth/auth.api'

const SignUpPage: React.FC = () => {
  const [signUp, { isLoading }] = useSignUpMutation()

  const onSignUp = async (data: Record<string, any>) => await signUp(data as SignUp)

  return (
    <>
      <PageTitle title="Sign up" />
      <AuthPage
        title="Sign up for your account"
        loading={isLoading}
        btnLabel="Sign up"
        onFormSubmit={onSignUp}
        formFields={{
          name: {
            type: 'text',
            placeholder: 'Enter full name',
            registerOptions: {
              required: 'required',
              minLength: 2,
              maxLength: 100,
            },
          },
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
          <Link className={classes.auth__link} to={routes.auth.signIn}>
            Already have an account? Sign in
          </Link>
        }
      />
    </>
  )
}

export default SignUpPage
