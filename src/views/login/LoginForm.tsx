import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { SignIn } from '~src/store/types'
import { validation } from '~src/utils/constants'

export interface LoginFormProps extends ComponentPropsWithoutRef<'form'> {
  loading: boolean
  onLogin: (data: SignIn) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ loading, onLogin, ...rest }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange' })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  return (
    <form onSubmit={handleSubmit(onLogin)} className="card card-md" {...rest}>
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Login to your account</h2>
        <div className="mb-3">
          <label className="form-label required">Email address</label>
          <input
            type="email"
            placeholder="Enter email"
            className={errors.email ? 'form-control is-invalid' : 'form-control'}
            {...register('email', {
              required: 'required',
              pattern: {
                value: validation.email,
                message: 'email is not valid.',
              },
            })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="mb-2">
          <label className="form-label required">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className={errors.password ? 'form-control is-invalid' : 'form-control'}
            {...register('password', {
              required: 'required',
              pattern: {
                value: validation.password,
                message: 'password is not valid.',
              },
            })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          <div className="form-footer input-icon">
            <button type="submit" className="btn btn-primary w-100" disabled={disabled}>
              {loading && <div className="spinner-border spinner-border-sm me-2" role="status" />}
              Sign in
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
