import React, { useMemo } from 'react'

import { AsPolymorphicComponentPropsWithRef } from '../props'
import { buildClassName } from '../helpers'
import { As, Spinner, SpinnerProps, Text, TextProps } from '../index'

import * as classes from './Button.module.scss'

const defaultElement = 'button'

export interface ButtonOwnProps {
  light?: boolean | undefined
  primary?: boolean | undefined
  avatar?: boolean | undefined
  close?: boolean | undefined
  left?: boolean | undefined
  right?: boolean | undefined
  start?: boolean | undefined
  end?: boolean | undefined
  text?: TextProps | undefined
  textAppend?: boolean | undefined
  spinner?: SpinnerProps | boolean | undefined
  spinnerAppend?: boolean | undefined
}

export type ButtonProps<E extends React.ElementType = typeof defaultElement> = AsPolymorphicComponentPropsWithRef<
  E,
  ButtonOwnProps
>

export const Button = <E extends React.ElementType = typeof defaultElement>({
  as,
  children,
  primary,
  light,
  avatar,
  close,
  left,
  right,
  start,
  end,
  text,
  textAppend,
  spinner,
  spinnerAppend,
  className: cn,
  ...rest
}: ButtonProps<E>) => {
  const Element = useMemo(() => as || defaultElement, [as])

  const className = useMemo(
    () =>
      buildClassName(
        classes.button,
        cn,
        primary ? classes.button_primary : '',
        light ? classes.button_light : '',
        avatar ? classes.button_avatar : '',
        close ? classes.button_close : '',
        left ? classes.button_left : '',
        right ? classes.button_right : '',
        start ? classes.button_start : '',
        end ? classes.button_end : ''
      ),
    [avatar, close, cn, end, left, light, primary, right, start]
  )

  const spinnerElement = useMemo(
    () => spinner && (true === spinner ? <Spinner /> : <Spinner {...spinner} />),
    [spinner]
  )

  const textElement = useMemo(() => text && <Text {...text} />, [text])

  return (
    <As as={Element} className={className} {...rest}>
      {!spinnerAppend && spinnerElement}
      {!textAppend && textElement}
      {children}
      {textAppend && textElement}
      {spinnerAppend && spinnerElement}
    </As>
  )
}
