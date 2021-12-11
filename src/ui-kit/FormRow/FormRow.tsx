import React, { useMemo } from 'react'

import { AsPolymorphicComponentPropsWithRef } from '../props'
import { buildClassName } from '../helpers'
import { As } from '../index'

import * as classes from './FormRow.module.scss'

const defaultElement = 'div'

export type FormRowProps<E extends React.ElementType = typeof defaultElement> = AsPolymorphicComponentPropsWithRef<E>

export const FormRow = <E extends React.ElementType = typeof defaultElement>({
  as,
  children,
  className: cn,
  ...rest
}: FormRowProps<E>) => {
  const Element = useMemo(() => as || defaultElement, [as])
  const className = useMemo(() => buildClassName(classes.formRow, cn), [cn])

  return (
    <As as={Element} className={className} {...rest}>
      {children}
    </As>
  )
}
