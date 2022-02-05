import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps, ChildrenProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './FormRow.module.scss';

export type FormRowProps = BreakpointProps & ChildrenProps & React.ComponentPropsWithRef<'div'>;

const FormRowRender = ({ children, ...props }: FormRowProps, ref?: React.Ref<HTMLDivElement>) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'formRow'), [props]);

  const className = useMemo(() => buildClassName(styles.formRow, cn), [cn]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
};

export const FormRow = forwardRef(FormRowRender);
