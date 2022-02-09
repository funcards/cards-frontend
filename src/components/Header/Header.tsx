import React, { useCallback } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { RiHome2Line, RiAddLine } from 'react-icons/ri';
import { IoNotificationsOutline } from 'react-icons/io5';

import { appShortName, routes } from '@/config';
import { Text, UserMenu } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { openAddBoard, selectAuth } from '@/store';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuth);

  const onOpenAddBoard = useCallback(() => dispatch(openAddBoard()), [dispatch]);

  return (
    <>
      <header className={styles.header}>
        <Link to={routes.root} className={styles.header__logo}>
          {appShortName}
        </Link>
        <ul className={styles.header__group}>
          <li>
            <Link to={routes.board.list} className={styles.header__btn}>
              <RiHome2Line />
              <Text className={styles.header__text} show="md">
                Boards
              </Text>
            </Link>
          </li>
        </ul>
        <ul className={styles.header__group}>
          <li>
            <button className={styles.header__btn} onClick={onOpenAddBoard}>
              <RiAddLine />
            </button>
          </li>
          <li>
            <button className={styles.header__btn}>
              <IoNotificationsOutline />
            </button>
          </li>
          {isAuthenticated && <UserMenu />}
        </ul>
      </header>
      <Outlet />
    </>
  );
};
