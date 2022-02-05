import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useSwitchElement } from '.';

const margin = 4;
const style = { top: '-1000px', left: '-1000px', height: '0px' };

const calcLeftTop = (btn: DOMRect, menu: DOMRect) => {
  const tt = btn.y - menu.height - margin;
  const bt = btn.y + btn.height + margin;
  const left = Math.max(margin, btn.x + menu.width > window.innerWidth ? btn.x + btn.width - menu.width : btn.x);
  const top = bt + menu.height > window.innerHeight && tt >= 0 ? tt : bt;

  return { left: `${left}px`, top: `${top}px` };
};

export type DropdownMenuOptions = {
  initialStyle?: { left: string; top: string; height: string } | undefined;
  initialState?: boolean | undefined;
  closeFn?: () => void;
  openFn?: () => void;
};

export const useDropdownMenu = <B extends HTMLElement = HTMLButtonElement, M extends HTMLElement = HTMLDivElement>({
  initialStyle = style,
  initialState,
  closeFn,
  openFn,
}: DropdownMenuOptions = {}) => {
  const [menuStyle, setMenuStyle] = useState(initialStyle);
  const buttonRef: React.MutableRefObject<B | null> = useRef(null);
  const { ref: menuRef, isOpened, ...rest } = useSwitchElement<M>(initialState, closeFn, openFn);

  const calc = useCallback(() => {
    if (!buttonRef.current || !menuRef.current || !isOpened) {
      return;
    }

    const btnRect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    setMenuStyle({ ...calcLeftTop(btnRect, menuRect), height: 'auto' });
  }, [isOpened, menuRef]);

  useEffect(() => {
    window.addEventListener('resize', calc);

    return () => {
      window.removeEventListener('resize', calc);
    };
  }, [calc]);

  useEffect(() => {
    if (isOpened) {
      calc();
    } else {
      setMenuStyle(initialStyle);
    }
  }, [calc, initialStyle, isOpened]);

  return { buttonRef, menuStyle, menuRef, isOpened, ...rest };
};
