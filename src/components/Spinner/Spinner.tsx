import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps } from '../types';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './Spinner.module.scss';

export type SpinnerProps = BreakpointProps & React.ComponentPropsWithRef<'span'>;

const SpinnerRender = (props: SpinnerProps, ref?: React.Ref<HTMLSpanElement>) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'spinner'), [props]);

  const className = useMemo(() => buildClassName(styles.spinner, cn), [cn]);

  return <span ref={ref} className={className} {...rest} />;
};

export const Spinner = forwardRef(SpinnerRender);
