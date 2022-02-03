import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks';
import { selectAuth } from '@/store';
import { routes } from '@/config';

export type RequireAuthProps = {
  children?: React.ReactNode | undefined;
};

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  if (isAuthenticated) {
    if (children) {
      return <>{children}</>;
    }

    return <Outlet />;
  }

  return <Navigate to={routes.auth.signIn} state={{ from: location }} />;
};
