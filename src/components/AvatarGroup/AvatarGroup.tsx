import React, { forwardRef, useMemo, Children } from 'react';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './AvatarGroup.module.scss';

export type AvatarGroupProps = BreakpointProps &
  React.ComponentPropsWithRef<'ul'> & {
    children?: React.ReactNode | undefined;
  };

const AvatarGroupRender = ({ children, ...props }: AvatarGroupProps, ref?: React.Ref<HTMLUListElement>) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'avatarGroup'), [props]);

  const className = useMemo(() => buildClassName(styles.avatarGroup, cn), [cn]);

  return (
    <ul ref={ref} className={className} {...rest}>
      {Children.map(children, (child, index) => (
        <li className={styles.avatarGroup__item} key={index}>
          {child}
        </li>
      ))}
    </ul>
  );
};

export const AvatarGroup = forwardRef(AvatarGroupRender);
