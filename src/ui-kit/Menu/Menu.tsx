import React, { useCallback, useMemo, useRef } from 'react'
import { Menu as ReachMenu, MenuButton, MenuList } from '@reach/menu-button'
import { TiTimes, TiChevronLeft } from 'react-icons/ti'
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

import { Button } from '~src/ui-kit'

import * as classes from './Menu.module.scss'

export type MenuProps = {
  as?: string | undefined
  className?: string | undefined
  btn?: React.ReactElement | undefined
  btnClassName?: string | undefined
  children: React.ReactNode
  name: string
  onMenuOpen?: () => void
  showPrev?: boolean | undefined
  onPrev?: () => void
}

export const Menu: React.FC<MenuProps> = ({
  as = React.Fragment,
  className,
  btn,
  btnClassName,
  children,
  name,
  onMenuOpen,
  showPrev,
  onPrev,
}) => {
  const ref: React.MutableRefObject<HTMLButtonElement | null> = useRef(null)

  const onOpen = useCallback(() => onMenuOpen && onMenuOpen(), [onMenuOpen])

  const onPrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onPrev && onPrev()
    },
    [onPrev]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      ref.current?.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
        })
      )
    },
    [ref]
  )

  const rmProps = useMemo(() => (className ? { className } : {}), [className])
  const mbProps = useMemo(() => (btnClassName ? { className: btnClassName } : {}), [btnClassName])

  return (
    <ReachMenu as={as} {...rmProps}>
      <MenuButton aria-label={name} ref={ref} onMouseDown={onOpen} {...mbProps}>
        {btn || <IoEllipsisHorizontalOutline aria-hidden onMouseDown={onMouseDown} />}
      </MenuButton>
      <MenuList className={classes.menu__list}>
        <div className={classes.menu__header}>
          {showPrev && (
            <Button aria-hidden className={classes.menu__prev} close={true} onClick={onPrevious}>
              <TiChevronLeft />
            </Button>
          )}
          {name}
          <Button aria-hidden className={classes.menu__close} close={true} onMouseDown={onMouseDown}>
            <TiTimes />
          </Button>
        </div>
        {React.Children.map(children, (element, index) => (
          <div key={index} className={classes.menu__group}>
            {element}
          </div>
        ))}
      </MenuList>
    </ReachMenu>
  )
}
