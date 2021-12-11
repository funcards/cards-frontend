import React, { useCallback, useEffect, useRef, useState } from 'react';

export type Props = {
  onTriggered: (e: Event) => void
  initial?: boolean | undefined
}

export type UseDetectClickOutside<E> = {
  ref: React.MutableRefObject<E | null>
  registerDetect: () => void
  unregisterDetect: () => void
}

export const useDetectClickOutside = <E>({ onTriggered, initial }: Props): UseDetectClickOutside<E> => {
  const [registered, setRegistered] = useState(!!initial)

  const ref: React.MutableRefObject<E | null> = useRef(null)

  const keyListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onTriggered(e)
      }
    },
    [onTriggered]
  )

  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (ref && ref.current) {
        if (!(ref.current! as any).contains(e.target)) {
          onTriggered(e)
        }
      }
    },
    [onTriggered]
  )

  const registerDetect = useCallback(() => {
    setRegistered(true)
    document.addEventListener('click', clickListener)
    document.addEventListener('keyup', keyListener)
  }, [clickListener, keyListener])

  const unregisterDetect = useCallback(() => {
    if (registered) {
      setRegistered(false)
      document.removeEventListener('click', clickListener)
      document.removeEventListener('keyup', keyListener)
    }
  }, [clickListener, keyListener, registered])

  useEffect(() => {
    if (!registered) {
      registerDetect()
    }

    return unregisterDetect
  }, [clickListener, keyListener, registerDetect, registered, unregisterDetect])

  return { ref, registerDetect, unregisterDetect }
}
