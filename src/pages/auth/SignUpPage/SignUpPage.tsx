import React, { useCallback, useMemo } from 'react'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { AuthFooter, AuthMain, AuthTitle } from '../components'

import { emailSchema, passwordSchema } from '~src/store/auth/auth.validation'
import { routes } from '~src/utils/constants'
import { Button, Form, FormRow, FormTextField } from '~src/ui-kit'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { signUp } from '~src/store/auth/auth.slice'
import { SignUp } from '~src/store/auth/auth.types'
import { PageTitle } from '~src/components'

const schema = yup
  .object({
    name: yup.string().required().min(2, 'Name is too short').max(100, 'Name is too long'),
    email: emailSchema,
    password: passwordSchema,
  })
  .required()

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useTypedSelector(selectAuthState)

  const onSubmit = useCallback((data) => dispatch(signUp(data)), [dispatch])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SignUp>({ mode: 'onChange', resolver: yupResolver(schema) })

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid])

  return (
    <AuthMain>
      <PageTitle title="Sign up" />
      <AuthTitle title="Sign up for your account" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextField
          type="text"
          placeholder="Enter full name"
          row={true}
          showError={true}
          error={errors.name}
          {...register('name')}
        />
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
          error={errors.password}
          {...register('password')}
        />
        <FormRow>
          <Button type="submit" primary={true} disabled={disabled} spinner={isLoading}>
            Sign Up
          </Button>
        </FormRow>
      </Form>
      <AuthFooter>
        <Link to={routes.auth.signIn}>Already have an account? Sign in</Link>
      </AuthFooter>
    </AuthMain>
  )
}

export default SignUpPage
