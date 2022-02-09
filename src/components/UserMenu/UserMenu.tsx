import React, { useCallback, useRef } from 'react';
import { RiUser6Line, RiSettingsLine, RiLogoutCircleLine } from 'react-icons/ri';

import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { selectAuth, signOut } from '@/store';
import { Avatar, DdMenu, DdMenuHeader, DdMenuItem, DdMenuItems } from '@/components';

import styles from './UserMenu.module.scss';

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(selectAuth);
  const buttonRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const { ref: menuRef, isOpened, onOpen, onClose } = useSwitchElement<HTMLDivElement>();

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
      <DdMenu ref={menuRef} targetRef={buttonRef} hidden={!isOpened}>
        <DdMenuHeader>Account</DdMenuHeader>
        <DdMenuItems className={styles.user}>
          <Avatar className={styles.user__avatar} alt={currentUser.name} src={currentUser.email} />
          <div className={styles.user__name}>{currentUser.name}</div>
          <div className={styles.user__email}>{currentUser.email}</div>
        </DdMenuItems>
        <DdMenuItems>
          <DdMenuItem>
            <RiUser6Line />
            Profile
          </DdMenuItem>
          <DdMenuItem>
            <RiSettingsLine />
            Settings
          </DdMenuItem>
        </DdMenuItems>
        <DdMenuItems>
          <DdMenuItem onClick={onSignOut}>
            <RiLogoutCircleLine />
            Log out
          </DdMenuItem>
        </DdMenuItems>
      </DdMenu>
    </li>
  );
};
