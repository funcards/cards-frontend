import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { routes } from '~src/utils/constants'
import { getAuth } from '~src/modules/auth/auth.selectors'

export const RequireAuth: React.FC = () => {
  const { isAuthenticated } = useSelector(getAuth)
  const location = useLocation()

  if (isAuthenticated) {
    return <Outlet />
  }

  return <Navigate to={routes.auth.signIn} state={{ from: location }} />
}
