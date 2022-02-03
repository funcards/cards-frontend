import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './TextField.module.scss';

export type TextFieldProps = BreakpointProps &
  React.ComponentPropsWithRef<'input' | 'textarea'> & {
    multiLine?: boolean | undefined;
    error?: any;
  };

const TextFieldRender = (
  { multiLine, error, ...props }: TextFieldProps,
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'input'), [props]);

  const className = useMemo(() => buildClassName(styles.input, cn, error ? styles.input__error : ''), [cn, error]);

  if (multiLine) {
    return <textarea ref={ref as React.Ref<HTMLTextAreaElement> | undefined} className={className} {...rest} />;
  }

  return <input ref={ref as React.Ref<HTMLInputElement> | undefined} className={className} {...rest} />;
};

export const TextField = forwardRef(TextFieldRender);
