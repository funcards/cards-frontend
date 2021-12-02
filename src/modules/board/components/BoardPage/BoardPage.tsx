import React from 'react'
import { useParams } from 'react-router-dom'

import { useTypedSelector } from '~src/store'
import { useGetBoardQuery } from '~src/modules/board/board.api'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { getBoard } from '~src/modules/board/board.selectors'

const BoardPage: React.FC = () => {
  const { boardId } = useParams()

  const { isLoading, error } = useGetBoardQuery(boardId as string)
  const board = useTypedSelector((state) => getBoard(state, boardId as string))

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div>{JSON.stringify(error)}</div>
      <div>
        {board?.board_id} - {board?.name}
      </div>
    </>
  )
}

export default BoardPage
