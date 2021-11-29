import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { useForm, RegisterOptions } from 'react-hook-form'

import * as classes from './AuthForm.module.scss'

export interface FormField {
  type: string
  placeholder: string
  registerOptions: RegisterOptions
}

export interface AuthFormProps extends ComponentPropsWithoutRef<'form'> {
  loading: boolean
  btnLabel: string
  formFields: Record<string, FormField>
  onFormSubmit: (data: Record<string, any>) => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  className,
  loading,
  btnLabel,
  formFields,
  onFormSubmit,
  ...rest
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: 'onChange' })

  const disabled = useMemo(() => loading || !isDirty || !isValid, [loading, isDirty, isValid])

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={`${className} ${classes.form}`} {...rest}>
      {Object.keys(formFields).map((key) => (
        <div key={key} className={classes.form__row}>
          <input
            type={formFields[key].type}
            placeholder={formFields[key].placeholder}
            className={errors[key] ? `${classes.form__input} ${classes.form__input_error}` : classes.form__input}
            {...register(key, formFields[key].registerOptions)}
          />
          {errors[key] && <strong className={classes.form__error}>{errors[key].message}</strong>}
        </div>
      ))}
      <div className={classes.form__row}>
        <button type="submit" className={classes.form__btn} disabled={disabled}>
          {loading && <span role="loading" />}
          {btnLabel}
        </button>
      </div>
    </form>
  )
}
