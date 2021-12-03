import React from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'

import { selectAuthState } from '~src/modules/auth/auth.selectors'
import { routes } from '~src/utils/constants'
import { useTypedSelector } from '~src/store'

export interface RequireNotAuthProps extends RouteProps {
  children: any
}

export const RequireNotAuth: React.FC<RequireNotAuthProps> = ({ children }) => {
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || routes.board.list

    return <Navigate to={from} replace={true} />
  }

  return children
}
