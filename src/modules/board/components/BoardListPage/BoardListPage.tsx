import React, { useCallback, useEffect, useMemo } from 'react'
import { TiBook } from 'react-icons/ti'

import * as classes from './BoardListPage.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoardSate } from '~src/modules/board/board.selectors'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { loadBoards, openNewBoard } from '~src/modules/board/board.slice'
import { BoardListItem } from '~src/modules/board/components/BoardListItem/BoardListItem'
import { BoardStateStatus } from '~src/modules/board/board.types'

const BoardListPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, ids, items } = useTypedSelector(selectBoardSate)
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
              <TiBook className={classes.boardListPage__icon} />
              Your Workspace Boards
            </h1>
            <div className={classes.boardListPage__list}>
              {ids.map((id) => (
                <BoardListItem key={id} board={items[id]} />
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
