import React, { forwardRef, useMemo } from 'react'

import { BreakpointProps } from '../props'
import { buildClassName, breakpointsClassName } from '../helpers'

import * as classes from './TextField.module.scss'

export type TextFieldProps = BreakpointProps &
  React.ComponentPropsWithRef<'input' | 'textarea'> & {
    multiLine?: boolean | undefined
    error?: any
  }

export type TextFieldComponent = (props: TextFieldProps) => React.ReactElement | null

const TextFieldRender = (
  { multiLine, error, ...props }: TextFieldProps,
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>
) => {
  const rest = useMemo(() => {
    const { className, ...rest } = breakpointsClassName(props, classes, 'input')

    return { ...rest, className: buildClassName(classes.input, className, error ? classes.input__error : '') }
  }, [error, props])

  if (multiLine) {
    return <textarea ref={ref as React.Ref<HTMLTextAreaElement> | undefined} {...rest} />
  }

  return <input ref={ref as React.Ref<HTMLInputElement> | undefined} {...rest} />
}

export const TextField: TextFieldComponent = forwardRef(TextFieldRender)
