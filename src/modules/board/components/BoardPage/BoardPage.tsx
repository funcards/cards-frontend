import React from 'react'
import { useParams } from 'react-router-dom'

import { useTypedSelector } from '~src/store'
import { useGetBoardQuery } from '~src/modules/board/board.api'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { getBoard } from '~src/modules/board/board.selectors'
import NotFound from '~src/modules/common/components/NotFound/NotFound'

const BoardPage: React.FC = () => {
  const { boardId } = useParams<'boardId'>()

  const { isLoading, isError } = useGetBoardQuery(boardId as string)
  const board = useTypedSelector((state) => getBoard(state, boardId as string))

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
