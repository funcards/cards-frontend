import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { routes } from '~src/utils/constants'
import { useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'

export type RequireNotAuthProps = {
  children?: React.ReactNode | undefined
}

export const RequireNotAuth: React.FC<RequireNotAuthProps> = ({ children }) => {
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || routes.board.list

    return <Navigate to={from} replace={true} />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
