import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'
import { TiUserOutline, TiCogOutline, TiPowerOutline } from 'react-icons/ti'

import * as classes from './UserMenu.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'
import { signOut } from '~src/store/auth/auth.slice'
import { Avatar } from '~src/ui-kit'

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentUser } = useTypedSelector(selectAuthState)
  const onSignOut = useCallback(() => dispatch(signOut()), [dispatch])

  if (!currentUser) {
    return <></>
  }

  return (
    <Menu as="li">
      <MenuButton className={classes.userMenu}>
        <Avatar alt={currentUser.name} src={currentUser.email} />
      </MenuButton>
      <MenuList className={classes.userMenuItems}>
        <div className={classes.userMenuItems__header}>Account</div>
        <div className={classes.userMenuItems__info}>
          <Avatar className={classes.userMenuItems__avatar} alt={currentUser.name} src={currentUser.email} />
          <div className={classes.userMenuItems__name}>{currentUser.name}</div>
          <div className={classes.userMenuItems__email}>{currentUser.email}</div>
        </div>
        <div className={classes.userMenuItems__group}>
          <Link to="/profile" className={classes.userMenuItems__item}>
            <TiUserOutline className={classes.userMenuItems__icon} />
            Profile
          </Link>
          <Link to="/settings" className={classes.userMenuItems__item}>
            <TiCogOutline className={classes.userMenuItems__icon} />
            Settings
          </Link>
        </div>
        <div className={classes.userMenuItems__group}>
          <MenuItem className={classes.userMenuItems__item} onSelect={onSignOut}>
            <TiPowerOutline className={classes.userMenuItems__icon} />
            Log out
          </MenuItem>
        </div>
      </MenuList>
    </Menu>
  )
}
