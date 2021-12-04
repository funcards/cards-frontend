import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { selectBoard, selectBoardSate } from '~src/modules/board/board.selectors'
import NotFound from '~src/modules/common/components/NotFound/NotFound'
import { BoardStateStatus } from '~src/modules/board/board.types'
import { loadBoard } from '~src/modules/board/board.slice'

const BoardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, isError } = useTypedSelector(selectBoardSate)
  const { boardId } = useParams<'boardId'>()
  const board = useTypedSelector((state) => selectBoard(state, boardId!))
  const isLoading = useMemo(() => BoardStateStatus.LoadOneBoard === status, [status])

  useEffect(() => {
    dispatch(loadBoard(boardId!))
  }, [dispatch, boardId])

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <NotFound />
  }

  return (
    <>
      <div>
        {board?.board_id} - {board?.name}
      </div>
    </>
  )
}

export default BoardPage
