import React, { useMemo } from 'react'
import querystring from 'query-string'
import isRetina from 'is-retina'
import encoder from 'md5'
import { Tooltip } from '@reach/tooltip'
import * as yup from 'yup'

import { AsPolymorphicComponentPropsWithRef } from '../props'
import { buildClassName } from '../helpers'
import { As } from '../index'

import * as classes from './Avatar.module.scss'

const defaultParams = {
  domain: 'https://www.gravatar.com/avatar/',
  size: 50,
  rating: 'g',
  d: 'retro',
}

const defaultElement = 'span'

export interface AvatarOwnProps {
  alt: string
  src: string
  srcSet?: string | undefined
  size?: number | undefined
  rating?: string | undefined
  d?: string | undefined
}

export type AvatarProps<E extends React.ElementType = typeof defaultElement> = AsPolymorphicComponentPropsWithRef<
  E,
  AvatarOwnProps
>

export const Avatar = <E extends React.ElementType = typeof defaultElement>({
  as,
  alt,
  src,
  srcSet,
  size,
  rating,
  d,
  className: cn,
  style: s,
  ...rest
}: AvatarProps<E>) => {
  const Element = useMemo(() => as || defaultElement, [as])
  const className = useMemo(() => buildClassName(classes.avatar, cn), [cn])

  const style = useMemo(() => {
    const url = { src, srcSet: srcSet ?? src }

    if (yup.string().email().isValidSync(src)) {
      const params = { size: size ?? defaultParams.size, r: rating ?? defaultParams.rating, d: d ?? defaultParams.d }
      const hash = encoder(src.trim().toLowerCase(), { encoding: 'binary' })
      const query = querystring.stringify(params)
      const querySet = querystring.stringify({ ...params, size: params.size * 2 })

      url.src = `${defaultParams.domain}${hash}?${query}`
      url.srcSet = `${defaultParams.domain}${hash}?${querySet}`
    }

    return { ...s, backgroundImage: isRetina() ? `url("${url.srcSet}")` : `url("${url.src}")` }
  }, [d, rating, s, size, src, srcSet])

  return (
    <Tooltip label={alt}>
      <As as={Element} style={style} className={className} {...rest} />
    </Tooltip>
  )
}
