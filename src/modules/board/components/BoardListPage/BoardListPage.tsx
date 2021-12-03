import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import * as classes from './BoardListPage.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardList, selectBoardSate } from '~src/modules/board/board.selectors'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { loadBoards } from '~src/modules/board/board.slice'
import { BoardListItem } from '~src/modules/board/components/BoardListItem/BoardListItem'
import { routes } from '~src/utils/constants'

const BoardListPage: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const boards = useTypedSelector(selectBoardList)
  const { isLoading } = useTypedSelector(selectBoardSate)

  useEffect(() => {
    dispatch(loadBoards())
  }, [dispatch])

  return (
    <>
      <PageTitle title="Boards" />
      {isLoading ? (
        <Loading />
      ) : (
        <main className={classes.boardListPage}>
          <div className={classes.boardListPage__container}>
            <h1 className={classes.boardListPage__title}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={classes.boardListPage__icon}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              Your Workspace boards
            </h1>
            <div className={classes.boardListPage__list}>
              {boards.map((board) => (
                <BoardListItem key={board.board_id} board={board} />
              ))}
              <Link
                to={routes.board.add}
                state={{ backgroundLocation: location }}
                className={classes.boardListPage__newItem}
                role="button"
              >
                Create new board
              </Link>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default BoardListPage
