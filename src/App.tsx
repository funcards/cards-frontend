import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { NotificationList } from '~src/modules/notification/components/NotificationList/NotificationList'
import { RequireAuth } from '~src/modules/auth/components/RequireAuth/RequireAuth'
import { RequireNotAuth } from '~src/modules/auth/components/RequireNotAuth/RequireNotAuth'
import { routes } from '~src/utils/constants'
import { useMeQuery } from '~src/modules/user/user.api'
import { Loader } from '~src/modules/common/components/Loader/Loader'

const SignInPage = lazy(() => import('~src/modules/auth/components/SignInPage/SignInPage'))
const SignUpPage = lazy(() => import('~src/modules/auth/components/SignUpPage/SignUpPage'))

const Boards: React.FC = () => {
  const { data: user, isLoading } = useMeQuery()

  if (isLoading) {
    return <Loader />
  }

  return <h1>{user?.email}</h1>
}

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
          <Route index element={<Boards />} />
        </Route>
        <Route path="*" element={<h1>NOT FOUND</h1>} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
