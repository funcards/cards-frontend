import React, { useCallback, useRef, useState } from 'react'

export const useSwitchElement = <E>(initialState?: boolean | undefined) => {
  const [isOpened, setIsOpened] = useState(!!initialState)
  const ref: React.MutableRefObject<E | null> = useRef(null)

  const keyListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpened(false)
    }
  }, [])

  const clickListener = useCallback((e: MouseEvent) => {
    if (ref && ref.current && !(ref.current as any).contains(e.target)) {
      setIsOpened(false)
    }
  }, [])

  const onOpen = useCallback(() => {
    setIsOpened(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpened(false)
  }, [])

  const registerEvents = useCallback(() => {
    document.addEventListener('click', clickListener)
    document.addEventListener('keyup', keyListener)
  }, [clickListener, keyListener])

  const unregisterEvents = useCallback(() => {
    document.removeEventListener('click', clickListener)
    document.removeEventListener('keyup', keyListener)
  }, [clickListener, keyListener])

  return { ref, isOpened, onOpen, onClose, registerEvents, unregisterEvents }
}
