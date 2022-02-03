import React, { forwardRef, useMemo } from 'react';
import { FieldError } from 'react-hook-form';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './FormError.module.scss';

export type FormErrorProps = BreakpointProps &
  React.ComponentPropsWithRef<'div'> & {
    error?: FieldError | undefined;
  };

const FormErrorRender = ({ error, ...props }: FormErrorProps, ref?: React.Ref<HTMLDivElement>) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'formError'), [props]);

  const className = useMemo(() => buildClassName(styles.formError, cn), [cn]);

  if (error) {
    return (
      <div ref={ref} className={className} {...rest}>
        {error.message}
      </div>
    );
  }

  return <></>;
};

export const FormError = forwardRef(FormErrorRender);
