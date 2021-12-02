import React from 'react'
import { Link } from 'react-router-dom'

import { routes } from '~src/utils/constants'
import { useTypedSelector } from '~src/store'
import { useGetBoardsQuery } from '~src/modules/board/board.api'
import { getBoards } from '~src/modules/board/board.selectors'
import { Loading } from '~src/modules/common/components/Loading/Loading'

const BoardListPage: React.FC = () => {
  const { isLoading } = useGetBoardsQuery()
  const boards = useTypedSelector(getBoards)

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      {Object.values(boards).map((board) => (
        <Link key={board?.board_id} to={routes.board.one(board?.board_id)}>
          {board?.name}
          <br />
        </Link>
      ))}
    </>
  )
}

export default BoardListPage
