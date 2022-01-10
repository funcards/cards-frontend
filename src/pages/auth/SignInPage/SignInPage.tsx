import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { emailSchema, passwordSchema } from '~src/store/auth/auth.validation'
import { appName, routes } from '~src/utils/constants'
import { Button, Form, FormRow, FormTextField } from '~src/ui-kit'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { signIn } from '~src/store/auth/auth.slice'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { SignIn } from '~src/store/auth/auth.types'
import { PageTitle } from '~src/components'

import { AuthFooter, AuthMain, AuthTitle } from '../components'

const schema = yup.object({ email: emailSchema, password: passwordSchema }).required()

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useTypedSelector(selectAuthState)

  const onSubmit = useCallback((data) => dispatch(signIn(data)), [dispatch])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SignIn>({ mode: 'onChange', resolver: yupResolver(schema) })

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  return (
    <AuthMain>
      <PageTitle title="Sign in" />
      <AuthTitle title={`Sign in to ${appName.long}`} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextField
          type="email"
          placeholder="Enter email"
          row={true}
          showError={true}
          error={errors.email}
          {...register('email')}
        />
        <FormTextField
          type="password"
          placeholder="Enter password"
          row={true}
          showError={true}
          {...register('password')}
        />
        <FormRow>
          <Button type="submit" primary={true} disabled={disabled} spinner={isLoading}>
            Sign In
          </Button>
        </FormRow>
      </Form>
      <AuthFooter>
        <Link to={routes.auth.forgotPassword}>Can&apos;t log in?</Link>
        <Link to={routes.auth.signUp}>Sign up for an account</Link>
      </AuthFooter>
    </AuthMain>
  )
}

export default SignInPage
