import React, { useCallback } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { TiHomeOutline, TiPlus } from 'react-icons/ti'
import { IoNotificationsOutline } from 'react-icons/io5'

import { appName, routes } from '~src/utils/constants'
import { Text } from '~src/ui-kit'
import { UserMenu } from '~src/components'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { openAddBoard } from '~src/store/ui/ui.slice'

import * as classes from './Header.module.scss'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useTypedSelector(selectAuthState)

  const onOpenAddBoard = useCallback(() => dispatch(openAddBoard()), [dispatch])

  return (
    <>
      <header className={classes.header}>
        <Link to={routes.root} className={classes.header__logo}>
          {appName.short}
        </Link>
        <ul className={classes.header__group}>
          <li>
            <Link to={routes.board.list} className={classes.header__btn}>
              <TiHomeOutline />
              <Text className={classes.header__text} show="md">
                Boards
              </Text>
            </Link>
          </li>
        </ul>
        <ul className={classes.header__group}>
          <li>
            <button className={classes.header__btn} onClick={onOpenAddBoard}>
              <TiPlus />
            </button>
          </li>
          <li>
            <button className={classes.header__btn} onClick={() => true}>
              <IoNotificationsOutline />
            </button>
          </li>
          {isAuthenticated && <UserMenu />}
        </ul>
      </header>

      <Outlet />
    </>
  )
}
