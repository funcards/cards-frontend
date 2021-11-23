import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { PageTitle } from '~src/components/helmet/PageTitle'
import { RequireAuth } from '~src/components/auth/RequireAuth'

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
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
)
