import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { NotificationList } from '~src/modules/notification/components/NotificationList/NotificationList'
import { RequireAuth } from '~src/modules/auth/components/RequireAuth/RequireAuth'
import { RequireNotAuth } from '~src/modules/auth/components/RequireNotAuth/RequireNotAuth'
import { routes } from '~src/utils/constants'

const SignInPage = lazy(() => import('~src/modules/auth/components/SignInPage/SignInPage'))
const SignUpPage = lazy(() => import('~src/modules/auth/components/SignUpPage/SignUpPage'))
const BoardListPage = lazy(() => import('~src/modules/board/components/BoardListPage/BoardListPage'))
const BoardPage = lazy(() => import('~src/modules/board/components/BoardPage/BoardPage'))

// dispatch(boardApi.util.resetApiState())
// dispatch(userApi.util.resetApiState())
// dispatch(authApi.util.resetApiState())
// dispatch(removeAll())

export const App: React.FC = () => (
  <BrowserRouter>
    <PageTitle />
    <NotificationList />
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<h1>HOME</h1>} />
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
        <Route path={routes.board.list} element={<RequireAuth />}>
          <Route index element={<BoardListPage />} />
          <Route path=":boardId" element={<BoardPage />} />
        </Route>
        <Route path="*" element={<h1>NOT FOUND</h1>} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
