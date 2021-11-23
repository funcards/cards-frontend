import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { PageTitle } from '~src/components/helmet/PageTitle'
import { RequireAuth } from '~src/components/auth/RequireAuth'
import { Auth } from '~src/components/auth/Auth'
import LoginPage from '~src/views/login/LoginPage'

export const App: React.FC = () => (
  <HelmetProvider>
    <BrowserRouter>
      <PageTitle />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/boards"
            element={
              <RequireAuth>
                <h1>Boards</h1>
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={
              <Auth>
                <LoginPage />
              </Auth>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
)
