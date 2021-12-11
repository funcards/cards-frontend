import React, { forwardRef, useMemo } from 'react'

import { FormError, FormRow, TextField, TextFieldProps } from '../index'

export type FormTextFieldProps = TextFieldProps & {
  row?: boolean | undefined
  showError?: boolean | undefined
  errorClassname?: string | undefined
}

export type FormTextFieldComponent = (props: FormTextFieldProps) => React.ReactElement | null

const FormTextFieldRender: FormTextFieldComponent = (
  { row, error, showError, errorClassname, ...rest }: FormTextFieldProps,
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>
) => {
  const textField = <TextField ref={ref as any} error={error} {...rest} />
  const formError = useMemo(
    () => (showError ? <FormError className={errorClassname} error={error} /> : <></>),
    [error, errorClassname, showError]
  )

  if (row) {
    return (
      <FormRow>
        {textField}
        {formError}
      </FormRow>
    )
  }

  return (
    <>
      {textField}
      {formError}
    </>
  )
}

export const FormTextField = forwardRef(FormTextFieldRender)
