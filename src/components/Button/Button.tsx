import React, { forwardRef, useMemo } from 'react';
import { RiArrowLeftSLine, RiCloseLine } from 'react-icons/ri';

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
    icon?: boolean | undefined;
    left?: boolean | undefined;
    right?: boolean | undefined;
    start?: boolean | undefined;
    end?: boolean | undefined;
    spinner?: SpinnerProps | boolean | undefined;
  };

const ButtonRender = (
  { children, primary, light, avatar, icon, left, right, start, end, spinner, ...props }: ButtonProps,
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
        icon ? styles.button_icon : '',
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

export type ButtonIconProps = BreakpointProps &
  ChildrenProps &
  React.ComponentPropsWithRef<'button'> & {
    left?: boolean | undefined;
    right?: boolean | undefined;
    start?: boolean | undefined;
    end?: boolean | undefined;
  };

const ButtonCloseRender = (props: ButtonIconProps, ref?: React.Ref<HTMLButtonElement>) =>
  ButtonRender(
    {
      children: <RiCloseLine />,
      icon: true,
      ...props,
    },
    ref
  );

const ButtonArrowLeftRender = (props: ButtonIconProps, ref?: React.Ref<HTMLButtonElement>) =>
  ButtonRender(
    {
      children: <RiArrowLeftSLine />,
      icon: true,
      ...props,
    },
    ref
  );

export const ButtonClose = forwardRef(ButtonCloseRender);
export const ButtonArrowLeft = forwardRef(ButtonArrowLeftRender);
