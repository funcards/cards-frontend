import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './Form.module.scss';

export type FormProps = BreakpointProps &
  React.ComponentPropsWithRef<'form'> & {
    children?: React.ReactNode | undefined;
  };

const FormRender = ({ children, ...props }: FormProps, ref?: React.Ref<HTMLFormElement>) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'form'), [props]);

  const className = useMemo(() => buildClassName(styles.form, cn), [cn]);

  return (
    <form ref={ref} className={className} {...rest}>
      {children}
    </form>
  );
};

export const Form = forwardRef(FormRender);
