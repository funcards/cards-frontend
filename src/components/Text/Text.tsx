import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps, ChildrenProps } from '@/components/types';
import { breakpointsClassName } from '@/components/helpers';

import styles from './Text.module.scss';

export type TextProps = BreakpointProps & ChildrenProps & React.ComponentPropsWithRef<'span'>;

const TextRender = ({ children, ...props }: TextProps, ref?: React.Ref<HTMLSpanElement>) => {
  const rest = useMemo(() => breakpointsClassName(props, styles, 'text'), [props]);

  return (
    <span ref={ref} {...rest}>
      {children}
    </span>
  );
};

export const Text = forwardRef(TextRender);
