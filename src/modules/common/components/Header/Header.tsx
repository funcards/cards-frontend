import React, { useCallback } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={classes.headerBtn__icon}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="5 12 3 12 12 3 21 12 19 12" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <rect x="10" y="12" width="4" height="4" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={classes.headerBtn__icon}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
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
                      Profile
                    </Link>
                    <Link to="/profile" className={classes.userMenu__item}>
                      Settings
                    </Link>
                  </div>
                  <div className={classes.userMenu__group}>
                    <MenuItem className={classes.userMenu__item} onSelect={onSignOut}>
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
