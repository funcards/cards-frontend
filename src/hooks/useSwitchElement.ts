import React, { useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const useSwitchElement = <E extends HTMLElement = HTMLElement>(
  initialState?: boolean | undefined,
  closeFn?: () => void,
  openFn?: () => void
) => {
  const [isOpened, setIsOpened] = useState(!!initialState);
  const [isOn, setIsOn] = useState(true);
  const ref: React.MutableRefObject<E | null> = useRef<E>(null);

  const onOpen = useCallback(() => {
    if (isOn) {
      setIsOpened(true);
      openFn && openFn();
    }
  }, [isOn, openFn]);

  const onClose = useCallback(() => {
    if (isOn) {
      setIsOpened(false);
      closeFn && closeFn();
    }
  }, [isOn, closeFn]);

  const onToggle = useCallback(() => {
    if (isOpened) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpened, onClose, onOpen]);

  useOnClickOutside(ref, onClose);

  return { ref, isOpened, setIsOpened, isOn, setIsOn, onOpen, onClose, onToggle };
};
