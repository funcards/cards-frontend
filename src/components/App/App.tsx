import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import { routes } from '~src/utils/constants'
import {
  ErrorWrapper,
  Header,
  Loading,
  NotificationList,
  PageTitle,
  RequireAuth,
  RequireNotAuth,
} from '~src/components'
import { AddBoard } from '~src/pages/board/components'

import * as classes from './App.module.scss'

const HomePage = lazy(() => import('~src/pages/home/HomePage/HomePage'))
const SignInPage = lazy(() => import('~src/pages/auth/SignInPage/SignInPage'))
const SignUpPage = lazy(() => import('~src/pages/auth/SignUpPage/SignUpPage'))
const BoardListPage = lazy(() => import('~src/pages/board/BoardListPage/BoardListPage'))
const BoardPage = lazy(() => import('~src/pages/board/BoardPage/BoardPage'))

export const App: React.FC = () => (
  <div className={classes.app}>
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
)
