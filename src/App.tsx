import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { RequireAuth } from '~src/modules/auth/components/RequireAuth/RequireAuth'
import { RequireNotAuth } from '~src/modules/auth/components/RequireNotAuth/RequireNotAuth'
import { routes } from '~src/utils/constants'

const SignInPage = lazy(() => import('~src/modules/auth/components/SignInPage/SignInPage'))
const SignUpPage = lazy(() => import('~src/modules/auth/components/SignUpPage/SignUpPage'))

export const App: React.FC = () => (
  <BrowserRouter>
    <PageTitle />
    <Suspense fallback={<div>Loading...</div>}>
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
          <Route index element={<h1>Boards</h1>} />
        </Route>
        <Route path="*" element={<h1>NOT FOUND</h1>} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
