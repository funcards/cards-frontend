import React, { forwardRef, useMemo } from 'react';
import encoder from 'md5';
import isRetina from 'is-retina';
import { stringify } from 'query-string';
import { Tooltip } from '@reach/tooltip';

import { email } from '@/validators';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './Avatar.module.scss';

const defaultParams = {
  domain: 'https://www.gravatar.com/avatar/',
  size: 50,
  rating: 'g',
  d: 'retro',
};

export type AvatarProps = BreakpointProps &
  React.ComponentPropsWithRef<'span'> & {
    alt: string;
    src: string;
    srcSet?: string | undefined;
    size?: number | undefined;
    rating?: string | undefined;
    d?: string | undefined;
  };

const AvatarRender = (
  { alt, src, srcSet, size, rating, d, style: s, ...props }: AvatarProps,
  ref?: React.Ref<HTMLSpanElement>
) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'avatar'), [props]);

  const className = useMemo(() => buildClassName(styles.avatar, cn), [cn]);

  const style = useMemo(() => {
    const url = { src, srcSet: srcSet ?? src };

    if (email.isValidSync(src)) {
      const params = { size: size ?? defaultParams.size, r: rating ?? defaultParams.rating, d: d ?? defaultParams.d };
      const hash = encoder(src.trim().toLowerCase(), { encoding: 'binary' });
      const query = stringify(params);
      const querySet = stringify({ ...params, size: params.size * 2 });

      url.src = `${defaultParams.domain}${hash}?${query}`;
      url.srcSet = `${defaultParams.domain}${hash}?${querySet}`;
    }

    return { ...s, backgroundImage: isRetina() ? `url("${url.srcSet}")` : `url("${url.src}")` };
  }, [d, rating, s, size, src, srcSet]);

  return (
    <Tooltip label={alt}>
      <span ref={ref} style={style} className={className} {...rest} />
    </Tooltip>
  );
};

export const Avatar = forwardRef(AvatarRender);
