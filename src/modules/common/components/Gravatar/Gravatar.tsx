import React, { ComponentPropsWithoutRef } from 'react'
import querystring from 'query-string'
import encoder from 'md5'

import { validation } from '~src/utils/constants'

export interface GravatarProps extends ComponentPropsWithoutRef<'img'> {
  alt: string
  email: string
  rating?: string
  domain?: string
  d?: string
  size?: number
}

export const Gravatar: React.FC<GravatarProps> = ({ alt, email, rating, domain, d, size, ...rest }) => {
  const s = size ?? 50
  const base = `${domain ?? 'https://www.gravatar.com'}/avatar/`
  const query = querystring.stringify({ s, r: rating ?? 'g', d: d ?? 'retro' })
  const setQuery = querystring.stringify({ s: s * 2, r: rating ?? 'g', d: d ?? 'retro' })
  const hash = validation.email.test(email) ? encoder(email.trim().toLowerCase(), { encoding: 'binary' }) : email
  const src = `${base}${hash}?${query}`
  const srcSet = `${base}${hash}?${setQuery}`

  return <img alt={alt} src={src} srcSet={srcSet} height={s} width={s} {...rest} />
}
