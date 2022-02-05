import React, { useCallback } from 'react';
import { TiUserOutline, TiCogOutline, TiPowerOutline } from 'react-icons/ti';

import { useAppDispatch, useAppSelector, useDropdownMenu } from '@/hooks';
import { selectAuth, signOut } from '@/store';
import { Avatar, DdMenu, DdMenuHeader, DdMenuItem, DdMenuItems } from '@/components';

import styles from './UserMenu.module.scss';

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(selectAuth);
  const { buttonRef, menuRef, menuStyle, onOpen, onClose } = useDropdownMenu();

  const onSignOut = useCallback(() => {
    onClose();
    dispatch(signOut());
  }, [dispatch, onClose]);

  if (!currentUser) {
    return <></>;
  }

  return (
    <li>
      <button ref={buttonRef} className={styles.btn} aria-label={currentUser.name} onClick={onOpen}>
        <Avatar alt={currentUser.name} src={currentUser.email} aria-hidden />
      </button>
      <DdMenu ref={menuRef} style={menuStyle}>
        <DdMenuHeader>Account</DdMenuHeader>
        <DdMenuItems className={styles.user}>
          <Avatar className={styles.user__avatar} alt={currentUser.name} src={currentUser.email} />
          <div className={styles.user__name}>{currentUser.name}</div>
          <div className={styles.user__email}>{currentUser.email}</div>
        </DdMenuItems>
        <DdMenuItems>
          <DdMenuItem>
            <TiUserOutline />
            Profile
          </DdMenuItem>
          <DdMenuItem>
            <TiCogOutline />
            Settings
          </DdMenuItem>
        </DdMenuItems>
        <DdMenuItems>
          <DdMenuItem onClick={onSignOut}>
            <TiPowerOutline />
            Log out
          </DdMenuItem>
        </DdMenuItems>
      </DdMenu>
    </li>
  );
};
