import React, { useMemo } from 'react'

import { buildClassName } from '../helpers'

import * as classes from './FormError.module.scss'

export type FormErrorProps = React.ComponentPropsWithoutRef<'strong'> & {
  error?: { message: string } | undefined
}

export const FormError: React.FC<FormErrorProps> = ({ error, className: cn, ...rest }) => {
  const className = useMemo(() => buildClassName(classes.formError, cn), [cn])
  const message = useMemo(() => error?.message, [error?.message])

  if (message) {
    return (
      <strong className={className} {...rest}>
        {message}
      </strong>
    )
  }

  return <></>
}
