import React, { useMemo } from 'react'

import { AsPolymorphicComponentPropsWithRef } from '../props'
import { As } from '../index'

const defaultElement = 'span'

export type TextProps<E extends React.ElementType = typeof defaultElement> = AsPolymorphicComponentPropsWithRef<E>

export const Text = <E extends React.ElementType = typeof defaultElement>({ as, ...rest }: TextProps<E>) => {
  const Element = useMemo(() => as || defaultElement, [as])

  return <As as={Element} {...rest} />
}
