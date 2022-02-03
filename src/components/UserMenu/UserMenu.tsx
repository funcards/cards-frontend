import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TiUserOutline, TiCogOutline, TiPowerOutline } from 'react-icons/ti';
import { Portal } from '@reach/portal';

import { useAppDispatch, useAppSelector, useDropdownMenu } from '@/hooks';
import { selectAuth, signOut } from '@/store';
import { Avatar } from '@/components';

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
      <button ref={buttonRef} className={styles.userMenu} aria-label={currentUser.name} onClick={onOpen}>
        <Avatar alt={currentUser.name} src={currentUser.email} aria-hidden />
      </button>
      <Portal>
        <div ref={menuRef} style={menuStyle} className={styles.userMenuItems}>
          <div className={styles.userMenuItems__header}>Account</div>
          <div className={styles.userMenuItems__info}>
            <Avatar className={styles.userMenuItems__avatar} alt={currentUser.name} src={currentUser.email} />
            <div className={styles.userMenuItems__name}>{currentUser.name}</div>
            <div className={styles.userMenuItems__email}>{currentUser.email}</div>
          </div>
          <div className={styles.userMenuItems__group}>
            <Link to="/profile" className={styles.userMenuItems__item}>
              <TiUserOutline className={styles.userMenuItems__icon} />
              Profile
            </Link>
            <Link to="/settings" className={styles.userMenuItems__item}>
              <TiCogOutline className={styles.userMenuItems__icon} />
              Settings
            </Link>
          </div>
          <div className={styles.userMenuItems__group}>
            <div className={styles.userMenuItems__item} onClick={onSignOut}>
              <TiPowerOutline className={styles.userMenuItems__icon} />
              Log out
            </div>
          </div>
        </div>
      </Portal>
    </li>
  );
};
