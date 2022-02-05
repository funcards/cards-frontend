import React, { forwardRef, useMemo } from 'react';

import { BreakpointProps, ChildrenProps } from '../types';
import { Spinner, SpinnerProps } from '..';
import { breakpointsClassName, buildClassName } from '../helpers';

import styles from './Button.module.scss';

export type ButtonProps = BreakpointProps &
  ChildrenProps &
  React.ComponentPropsWithRef<'button'> & {
    light?: boolean | undefined;
    primary?: boolean | undefined;
    avatar?: boolean | undefined;
    close?: boolean | undefined;
    left?: boolean | undefined;
    right?: boolean | undefined;
    start?: boolean | undefined;
    end?: boolean | undefined;
    spinner?: SpinnerProps | boolean | undefined;
  };

const ButtonRender = (
  { children, primary, light, avatar, close, left, right, start, end, spinner, ...props }: ButtonProps,
  ref?: React.Ref<HTMLButtonElement>
) => {
  const { className: cn, ...rest } = useMemo(() => breakpointsClassName(props, styles, 'button'), [props]);

  const className = useMemo(
    () =>
      buildClassName(
        styles.button,
        cn,
        primary ? styles.button_primary : '',
        light ? styles.button_light : '',
        avatar ? styles.button_avatar : '',
        close ? styles.button_close : '',
        left ? styles.button_left : '',
        right ? styles.button_right : '',
        start ? styles.button_start : '',
        end ? styles.button_end : ''
      ),
    [avatar, close, cn, end, left, light, primary, right, start]
  );

  const spinnerElement = useMemo(
    () => spinner && (true === spinner ? <Spinner /> : <Spinner {...spinner} />),
    [spinner]
  );

  return (
    <button ref={ref} className={className} {...rest}>
      {spinnerElement}
      {children}
    </button>
  );
};

export const Button = forwardRef(ButtonRender);
