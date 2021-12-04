import React, { useCallback, useEffect, useMemo } from 'react'

import * as classes from './BoardListPage.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardList, selectBoardSate } from '~src/modules/board/board.selectors'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { loadBoards, openNewBoard } from '~src/modules/board/board.slice'
import { BoardListItem } from '~src/modules/board/components/BoardListItem/BoardListItem'
import { BoardStateStatus } from '~src/modules/board/board.types'

const BoardListPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const boards = useTypedSelector(selectBoardList)
  const { status } = useTypedSelector(selectBoardSate)
  const isLoading = useMemo(() => BoardStateStatus.LoadBoardList === status, [status])

  const onOpenNewBoard = useCallback(() => dispatch(openNewBoard()), [dispatch])

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
              <button className={classes.boardListPage__newItem} onClick={onOpenNewBoard}>
                Create new board
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default BoardListPage
