import React, { useMemo } from 'react'

import { Text, TextProps } from '../index'
import { buildClassName } from '../helpers'

import * as classes from './Spinner.module.scss'

export type SpinnerProps<E extends React.ElementType = 'span'> = TextProps<E>

export const Spinner = <E extends React.ElementType = 'span'>({ className: cn, ...rest }: SpinnerProps<E>) => {
  const className = useMemo(() => buildClassName(cn, classes.spinner), [cn])

  return <Text className={className} {...rest} />
}
