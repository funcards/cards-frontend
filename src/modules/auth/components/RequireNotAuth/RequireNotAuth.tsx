import React from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getAuth } from '~src/modules/auth/auth.selectors'
import { routes } from '~src/utils/constants'

export interface RequireNotAuthProps extends RouteProps {
  children: any
}

export const RequireNotAuth: React.FC<RequireNotAuthProps> = ({ children }) => {
  const { isAuthenticated } = useSelector(getAuth)

  if (isAuthenticated) {
    const location = useLocation()
    const from = location.state?.from?.pathname || routes.board.list

    return <Navigate to={from} replace={true} />
  }

  return children
}
