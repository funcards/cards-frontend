import React from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { routes } from '~src/utils/constants'
import { getAuth } from '~src/modules/auth/auth.selectors'

export interface RequireAuthProps extends RouteProps {
  children: any
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useSelector(getAuth)
  const location = useLocation()

  if (isAuthenticated) {
    return children
  }

  return <Navigate to={routes.auth.login} state={{ from: location }} />
}
