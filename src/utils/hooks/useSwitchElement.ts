import React, { useCallback, useRef, useState } from 'react'

export const useSwitchElement = <E>(initialState?: boolean | undefined, closeFn?: () => void) => {
  const [isOpened, setIsOpened] = useState(!!initialState)
  const ref: React.MutableRefObject<E | null> = useRef(null)

  const keyListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpened(false)
        closeFn && closeFn()
      }
    },
    [closeFn]
  )

  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !(ref.current as any).contains(e.target)) {
        setIsOpened(false)
        closeFn && closeFn()
      }
    },
    [closeFn]
  )

  const onOpen = useCallback(() => {
    setIsOpened(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpened(false)
    closeFn && closeFn()
  }, [closeFn])

  const registerEvents = useCallback(() => {
    document.addEventListener('mouseup', clickListener)
    document.addEventListener('keyup', keyListener)
  }, [clickListener, keyListener])

  const unregisterEvents = useCallback(() => {
    document.removeEventListener('mouseup', clickListener)
    document.removeEventListener('keyup', keyListener)
  }, [clickListener, keyListener])

  return { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents }
}
