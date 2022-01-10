import React, { useEffect, useMemo } from 'react'
import { TiBook } from 'react-icons/ti'

import { BoardStateStatus } from '~src/store/board/board.types'
import { selectBoardState } from '~src/store/board/board.selectors'
import { loadBoards } from '~src/store/board/board.slice'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { Loading, PageTitle } from '~src/components'
import { BoardList } from '~src/pages/board/components'

import * as classes from './BoardListPage.module.scss'

const BoardListPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, loadedAll, boards } = useTypedSelector(selectBoardState)
  const isLoading = useMemo(() => BoardStateStatus.LoadBoardList === status, [status])

  useEffect(() => {
    if (!loadedAll) {
      dispatch(loadBoards())
    }
  }, [loadedAll, dispatch])

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
            <BoardList boards={boards} />
          </div>
        </main>
      )}
    </>
  )
}

export default BoardListPage
