import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

import * as classes from './Header.module.scss'

import { appName, routes } from '~src/utils/constants'
import { Gravatar } from '~src/modules/common/components/Gravatar/Gravatar'
import { useMeQuery } from '~src/modules/user/user.api'
import { useAppDispatch, signOutFn, useTypedSelector } from '~src/store'
import { getMe } from '~src/modules/user/user.selectors'

export const Header: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const me = useTypedSelector(getMe)
  const { isLoading } = useMeQuery()

  const onSignOut = async () => await signOutFn(dispatch)

  return (
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
          <Link
            to={routes.board.add}
            state={{ backgroundLocation: location }}
            className={classes.headerBtn}
            role="button"
          >
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
          </Link>
        </li>
        {!isLoading && me && (
          <Menu as="li">
            <MenuButton className={`${classes.headerBtn} ${classes.headerBtn_circle}`}>
              <Gravatar alt={me.name} email={me.email} className={classes.headerBtn__avatar} />
            </MenuButton>
            <MenuList className={classes.userMenu}>
              <div className={classes.userMenu__header}>Account</div>
              <div className={classes.userMenu__info}>
                <Gravatar className={classes.userMenu__avatar} email={me.email} alt={me.name} />
                <div className={classes.userMenu__name}>{me.name}</div>
                <div className={classes.userMenu__email}>{me.email}</div>
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
  )
}
