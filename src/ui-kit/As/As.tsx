import React, { forwardRef, useMemo } from 'react'

import { AsProps, PolymorphicRef } from '../props'
import { breakpointsClassName } from '../helpers'

import * as classes from './As.module.scss'

const defaultElement = 'div'

export type AsComponent = <E extends React.ElementType = typeof defaultElement>(
  props: AsProps<E>
) => React.ReactElement | null

const AsRender = <E extends React.ElementType = typeof defaultElement>(
  { as, children, ...props }: AsProps<E>,
  ref?: PolymorphicRef<E>
) => {
  const Element = useMemo(() => as || defaultElement, [as])
  const rest = useMemo(() => breakpointsClassName(props, classes, 'as'), [props])

  return (
    <Element ref={ref} {...rest}>
      {children}
    </Element>
  )
}

export const As: AsComponent = forwardRef(AsRender)
