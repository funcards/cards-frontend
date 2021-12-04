import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { routes } from '~src/utils/constants'
import { selectAuthState } from '~src/modules/auth/auth.selectors'
import { useTypedSelector } from '~src/store'

export const RequireAuth: React.FC = () => {
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const location = useLocation()

  if (isAuthenticated) {
    return <Outlet />
  }

  return <Navigate to={routes.auth.signIn} state={{ from: location }} />
}
