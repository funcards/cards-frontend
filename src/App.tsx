import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { NotificationList } from '~src/modules/notification/components/NotificationList/NotificationList'
import { RequireAuth } from '~src/modules/auth/components/RequireAuth/RequireAuth'
import { RequireNotAuth } from '~src/modules/auth/components/RequireNotAuth/RequireNotAuth'
import { routes } from '~src/utils/constants'
import NotFound from '~src/modules/common/components/NotFound/NotFound'

const SignInPage = lazy(() => import('~src/modules/auth/components/SignInPage/SignInPage'))
const SignUpPage = lazy(() => import('~src/modules/auth/components/SignUpPage/SignUpPage'))
const BoardListPage = lazy(() => import('~src/modules/board/components/BoardListPage/BoardListPage'))
const AddBoardPage = lazy(() => import('~src/modules/board/components/AddBoardPage/AddBoardPage'))
const BoardPage = lazy(() => import('~src/modules/board/components/BoardPage/BoardPage'))

export const App: React.FC = () => {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  return (
    <>
      <PageTitle />
      <NotificationList />
      <Suspense fallback={<Loading />}>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<h1>HOME</h1>} />
          <Route
            path={routes.auth.signIn}
            element={
              <RequireNotAuth>
                <SignInPage />
              </RequireNotAuth>
            }
          />
          <Route
            path={routes.auth.signUp}
            element={
              <RequireNotAuth>
                <SignUpPage />
              </RequireNotAuth>
            }
          />
          <Route path={routes.board.list} element={<RequireAuth />}>
            <Route index element={<BoardListPage />} />
            <Route path=":boardId" element={<BoardPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route path={routes.board.add} element={<AddBoardPage />} />
          </Routes>
        )}
      </Suspense>
    </>
  )
}
