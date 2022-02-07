import React, { ElementType, forwardRef, memo, useMemo } from 'react';
import { Popover, PopoverProps } from '@reach/popover';

import { buildClassName } from '@/components/helpers';
import { ChildrenProps } from '@/components/types';

import styles from './DdMenu.module.scss';

export type DdMenuProps<T extends ElementType = 'div'> = PopoverProps & React.ComponentPropsWithRef<T>;
export type DdMenuHeaderProps<T extends ElementType = 'div'> = ChildrenProps & React.ComponentPropsWithRef<T>;
export type DdMenuHeaderButtonProps = ChildrenProps &
  React.ComponentPropsWithRef<'button'> & { left?: boolean | undefined };
export type DdMenuItemsProps<T extends ElementType = 'div'> = ChildrenProps & React.ComponentPropsWithRef<T>;
export type DdMenuItemProps<T extends ElementType = 'div'> = ChildrenProps & React.ComponentPropsWithRef<T>;

const MenuRender = ({ className: cn, children, hidden, ...rest }: DdMenuProps, ref?: React.Ref<HTMLDivElement>) => {
  const className = useMemo(() => buildClassName(styles.ddMenu, hidden ? '' : styles.ddMenu_open, cn), [cn, hidden]);

  return (
    <Popover ref={ref} className={className} hidden={hidden} {...rest}>
      <div className={styles.ddMenu__container}>{children}</div>
    </Popover>
  );
};

const MenuHeaderRender = ({ children, className: cn, ...rest }: DdMenuHeaderProps, ref?: React.Ref<HTMLDivElement>) => {
  const className = useMemo(() => buildClassName(styles.ddMenu__header, cn), [cn]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
};

const MenuItemsRender = ({ children, className: cn, ...rest }: DdMenuItemsProps, ref?: React.Ref<HTMLDivElement>) => {
  const className = useMemo(() => buildClassName(styles.ddMenu__items, cn), [cn]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
};

const MenuItemRender = ({ children, className: cn, ...rest }: DdMenuItemProps, ref?: React.Ref<HTMLDivElement>) => {
  const className = useMemo(() => buildClassName(styles.ddMenu__item, cn), [cn]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
};

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
