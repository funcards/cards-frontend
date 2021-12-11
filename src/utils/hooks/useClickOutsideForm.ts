import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form/dist/types'
import { FieldPath } from 'react-hook-form/dist/types/utils'
import { useForm } from 'react-hook-form'
import React, { useCallback, useState } from 'react'

import { useDetectClickOutside } from './useDetectClickOutside'

export type UseDetectClickOutsideFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object
> = UseFormProps<TFieldValues, TContext> & {
  resetOnClose?: boolean | undefined
  focusOnOpen?: FieldPath<TFieldValues> | undefined
}

export type UseDetectClickOutsideFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  Element = HTMLFormElement,
  TContext extends object = object
> = UseFormReturn<TFieldValues, TContext> & {
  isOpened: boolean
  open: () => void
  close: () => void
  ref: React.MutableRefObject<Element | null>
}

export const useClickOutsideForm = <
  TFieldValues extends FieldValues = FieldValues,
  Element = HTMLFormElement,
  TContext extends object = object
>({
  resetOnClose,
  focusOnOpen,
  ...props
}: UseDetectClickOutsideFormProps<TFieldValues, TContext>): UseDetectClickOutsideFormReturn<
  TFieldValues,
  Element,
  TContext
> => {
  const [isOpened, setIsOpened] = useState(false)

  const { setFocus, reset, ...rest } = useForm(props)

  const onTriggered = useCallback(() => {
    if (resetOnClose) {
      reset()
    }
    setIsOpened(false)
  }, [reset, resetOnClose])

  const { ref, registerDetect, unregisterDetect } = useDetectClickOutside<Element>({
    onTriggered,
    initial: true,
  })

  const open = useCallback(() => {
    registerDetect()
    setIsOpened(true)
    if (focusOnOpen) {
      setFocus(focusOnOpen)
    }
  }, [focusOnOpen, registerDetect, setFocus])

  const close = useCallback(() => {
    unregisterDetect()
    setIsOpened(false)
    if (resetOnClose) {
      reset()
    }
  }, [reset, resetOnClose, unregisterDetect])

  return { isOpened, open, close, ref, setFocus, reset, ...rest }
}
