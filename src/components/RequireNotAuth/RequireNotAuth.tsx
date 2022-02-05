import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks';
import { selectAuth } from '@/store';
import { routes } from '@/config';
import { ChildrenProps } from '@/components/types';

export type RequireNotAuthProps = ChildrenProps;

export const RequireNotAuth: React.FC<RequireNotAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || routes.board.list;

    return <Navigate to={from} replace={true} />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};
