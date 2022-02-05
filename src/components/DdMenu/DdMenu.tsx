import React, { ElementType, forwardRef, memo, useMemo } from 'react';
import { Portal } from '@reach/portal';

import { buildClassName } from '@/components/helpers';
import { ChildrenProps } from '@/components/types';

import styles from './DdMenu.module.scss';

export type DdMenuProps<T extends ElementType = 'div'> = ChildrenProps & React.ComponentPropsWithRef<T>;
export type DdMenuHeaderButtonProps = DdMenuProps<'button'> & {
  left?: boolean | undefined;
};

const Render = (style: string, { children, className: cn, ...rest }: DdMenuProps, ref?: React.Ref<HTMLDivElement>) => {
  const className = buildClassName(style, cn);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
};

const MenuRender = (props: DdMenuProps, ref?: React.Ref<HTMLDivElement>) => {
  const children = useMemo(() => Render(styles.ddMenu, props, ref), [props, ref]);

  return <Portal>{children}</Portal>;
};

const MenuHeaderRender = (props: DdMenuProps, ref?: React.Ref<HTMLDivElement>) =>
  Render(styles.ddMenu__header, props, ref);

const MenuItemsRender = (props: DdMenuProps, ref?: React.Ref<HTMLDivElement>) =>
  Render(styles.ddMenu__items, props, ref);

const MenuItemRender = (props: DdMenuProps, ref?: React.Ref<HTMLDivElement>) => Render(styles.ddMenu__item, props, ref);

const MenuHeaderButtonRender = (
  { children, left, className: cn, ...rest }: DdMenuHeaderButtonProps,
  ref?: React.Ref<HTMLButtonElement>
) => {
  const className = useMemo(() => buildClassName(cn, left ? styles.ddMenu__left : styles.ddMenu__right), [cn, left]);

  return (
    <button ref={ref} className={className} {...rest}>
      {children}
    </button>
  );
};

export const DdMenu = forwardRef(MenuRender);
export const DdMenuHeader = memo(forwardRef(MenuHeaderRender));
export const DdMenuHeaderButton = forwardRef(MenuHeaderButtonRender);
export const DdMenuItems = memo(forwardRef(MenuItemsRender));
export const DdMenuItem = memo(forwardRef(MenuItemRender));
