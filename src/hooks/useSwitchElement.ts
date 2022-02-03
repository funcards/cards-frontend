import React, { useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export const useSwitchElement = <E extends HTMLElement = HTMLElement>(
  initialState?: boolean | undefined,
  closeFn?: () => void
) => {
  const [isOpened, setIsOpened] = useState(!!initialState);
  const [isOn, setIsOn] = useState(true);
  const ref: React.MutableRefObject<E | null> = useRef<E>(null);

  const onOpen = useCallback(() => {
    if (isOn) {
      setIsOpened(true);
    }
  }, [isOn]);

  const onClose = useCallback(() => {
    if (isOn) {
      setIsOpened(false);
      closeFn && closeFn();
    }
  }, [closeFn, isOn]);

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
