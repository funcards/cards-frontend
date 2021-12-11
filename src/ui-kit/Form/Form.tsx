import React, { forwardRef, useMemo } from 'react'

import { BreakpointProps } from '../props'
import { breakpointsClassName, buildClassName } from '../helpers'

import * as classes from './Form.module.scss'

export type FormProps = BreakpointProps & React.ComponentPropsWithRef<'form'>

export type FormComponent = (props: FormProps) => React.ReactElement | null

const FormRender = ({ children, ...props }: FormProps, ref?: React.Ref<HTMLFormElement>) => {
  const rest = useMemo(() => {
    const { className, ...rest } = breakpointsClassName(props, classes, 'form')

    return { ...rest, className: buildClassName(classes.form, className) }
  }, [props])

  return (
    <form ref={ref} {...rest}>
      {children}
    </form>
  )
}

export const Form: FormComponent = forwardRef(FormRender)
