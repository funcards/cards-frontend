import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { RequireAuth } from '~src/modules/auth/components/RequireAuth/RequireAuth'
import { RequireNotAuth } from '~src/modules/auth/components/RequireNotAuth/RequireNotAuth'
import { routes } from '~src/utils/constants'

const LoginPage = lazy(() => import('~src/modules/auth/components/LoginPage/LoginPage'))

export const App: React.FC = () => (
  <HelmetProvider>
    <BrowserRouter>
      <PageTitle />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path={routes.board.list}
            element={
              <RequireAuth>
                <h1>Boards</h1>
              </RequireAuth>
            }
          />
          <Route
            path={routes.auth.signIn}
            element={
              <RequireNotAuth>
                <LoginPage />
              </RequireNotAuth>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
)
