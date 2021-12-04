import React, { useCallback } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'
import { TiHomeOutline, TiPlus, TiUserOutline, TiCogOutline, TiPowerOutline } from 'react-icons/ti'

import * as classes from './Header.module.scss'

import { appName, routes } from '~src/utils/constants'
import { Gravatar } from '~src/modules/common/components/Gravatar/Gravatar'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { signOut } from '~src/modules/auth/auth.slice'
import { selectAuthState } from '~src/modules/auth/auth.selectors'
import { openNewBoard } from '~src/modules/board/board.slice'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, currentUser } = useTypedSelector(selectAuthState)

  const onOpenNewBoard = useCallback(() => dispatch(openNewBoard()), [dispatch])
  const onSignOut = useCallback(() => dispatch(signOut()), [dispatch])

  return (
    <>
      {isAuthenticated && (
        <header className={classes.header}>
          <Link to={routes.root} className={classes.header__logo}>
            {appName.short}
          </Link>
          <ul className={classes.header__group}>
            <li>
              <Link to={routes.board.list} className={classes.headerBtn} role="button">
                <TiHomeOutline className={classes.headerBtn__icon} />
                <span
                  className={`${classes.headerBtn__text} ${classes.headerBtn__text_bold} ${classes.headerBtn__text_md}`}
                >
                  Boards
                </span>
              </Link>
            </li>
          </ul>
          <ul className={classes.header__group}>
            <li>
              <button className={classes.headerBtn} onClick={onOpenNewBoard}>
                <TiPlus className={classes.headerBtn__icon} />
              </button>
            </li>
            {currentUser && (
              <Menu as="li">
                <MenuButton className={`${classes.headerBtn} ${classes.headerBtn_circle}`}>
                  <Gravatar alt={currentUser.name} email={currentUser.email} className={classes.headerBtn__avatar} />
                </MenuButton>
                <MenuList className={classes.userMenu}>
                  <div className={classes.userMenu__header}>Account</div>
                  <div className={classes.userMenu__info}>
                    <Gravatar className={classes.userMenu__avatar} email={currentUser.email} alt={currentUser.name} />
                    <div className={classes.userMenu__name}>{currentUser.name}</div>
                    <div className={classes.userMenu__email}>{currentUser.email}</div>
                  </div>
                  <div className={classes.userMenu__group}>
                    <Link to="/profile" className={classes.userMenu__item}>
                      <TiUserOutline className={classes.userMenu__icon} />
                      Profile
                    </Link>
                    <Link to="/settings" className={classes.userMenu__item}>
                      <TiCogOutline className={classes.userMenu__icon} />
                      Settings
                    </Link>
                  </div>
                  <div className={classes.userMenu__group}>
                    <MenuItem className={classes.userMenu__item} onSelect={onSignOut}>
                      <TiPowerOutline className={classes.userMenu__icon} />
                      Log out
                    </MenuItem>
                  </div>
                </MenuList>
              </Menu>
            )}
          </ul>
        </header>
      )}
      <Outlet />
    </>
  )
}
