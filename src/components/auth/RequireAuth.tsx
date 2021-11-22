import React from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getAuth } from '~src/store/selectors'
import { routes } from '~src/utils/constants'

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
