import React from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getAuth } from '~src/store/selectors'

export interface AuthProps extends RouteProps {
  children: any
}

export const Auth: React.FC<AuthProps> = ({ children }) => {
  const { isAuthenticated } = useSelector(getAuth)

  if (isAuthenticated) {
    const location = useLocation()
    const from = location.state?.from?.pathname || '/boards'

    return <Navigate to={from} replace={true} />
  }

  return children
}
