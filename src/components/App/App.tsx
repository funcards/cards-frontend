import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { routes } from '@/config';
import { AddBoard } from '@/pages/boards/components';

import { ErrorWrapper, Header, Loading, NotificationList, PageTitle, RequireAuth, RequireNotAuth } from '..';

import styles from './App.module.scss';

const HomePage = lazy(() => import('../../pages/home/HomePage'));
const SignInPage = lazy(() => import('../../pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('../../pages/auth/SignUpPage'));
const BoardListPage = lazy(() => import('../../pages/boards/BoardListPage'));
const BoardPage = lazy(() => import('../../pages/boards/BoardPage'));

export const App: React.FC = () => (
  <div className={styles.app}>
    <PageTitle />
    <NotificationList />
    <AddBoard />
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path={routes.auth.signIn}
          element={
            <RequireNotAuth>
              <SignInPage />
            </RequireNotAuth>
          }
        />
        <Route
          path={routes.auth.signUp}
          element={
            <RequireNotAuth>
              <SignUpPage />
            </RequireNotAuth>
          }
        />
        <Route element={<Header />}>
          <Route path={routes.root} element={<HomePage />} />
          <Route path={routes.board.list} element={<RequireAuth />}>
            <Route index element={<BoardListPage />} />
            <Route path=":boardId" element={<BoardPage />} />
          </Route>
          <Route
            path="*"
            element={<ErrorWrapper errorTitle="Page Not Found" errorMessage="Something went wrong :(" />}
          />
        </Route>
      </Routes>
    </Suspense>
  </div>
);
