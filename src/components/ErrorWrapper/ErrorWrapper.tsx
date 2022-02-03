import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTitle } from '@/components';
import { routes } from '@/config';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectAuth, signOut } from '@/store';

import styles from './ErrorWrapper.module.scss';

export type ErrorWrapperProps = {
  pageTitle?: string | undefined;
  errorTitle?: string | undefined;
  errorMessage?: string | undefined;
};

export const ErrorWrapper: React.FC<ErrorWrapperProps> = ({ pageTitle, errorTitle, errorMessage }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(selectAuth);
  const title = useMemo(() => pageTitle ?? errorTitle, [errorTitle, pageTitle]);

  const onSignOut = useCallback(() => {
    dispatch(signOut());
    navigate(routes.auth.signIn);
  }, [dispatch, navigate]);

  return (
    <main className={styles.errorWrapper}>
      {title && <PageTitle title={title} />}
      <div className={styles.errorWrapper__container}>
        {errorTitle && <h1 className={styles.errorWrapper__title}>{errorTitle}</h1>}
        {errorMessage && <p className={styles.errorWrapper__message}>{errorMessage}</p>}
        {currentUser && (
          <div className={styles.errorWrapper__auth}>
            <div>
              Not <strong className={styles.errorWrapper__user}>{currentUser.name}</strong>?
            </div>
            <button className={styles.errorWrapper__btn} onClick={onSignOut}>
              Switch accounts
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
