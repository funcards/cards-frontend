import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { routes } from '~src/utils/constants'
import { useTypedSelector } from '~src/store'
import { selectAuthState } from '~src/store/auth/auth.selector'

export type RequireAuthProps = {
  children?: React.ReactNode | undefined
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useTypedSelector(selectAuthState)
  const location = useLocation()

  if (isAuthenticated) {
    if (children) {
      return <>{children}</>
    }

    return <Outlet />
  }

  return <Navigate to={routes.auth.signIn} state={{ from: location }} />
}
