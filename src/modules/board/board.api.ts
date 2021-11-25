import axios from 'axios'
import querystring from 'query-string'
import dayjs from 'dayjs'

import { endpoints } from '~src/utils/constants'
import { toRecord } from '~src/utils/helpers'
import { PaginatedResponse } from '~src/modules/common/common.types'
import { Board, Member } from '~src/modules/board/board.types'

const toMember = (item: any): Member => {
  return {userId: item.user_id, roles: item.roles}
}

const toBoard = (item: any): Board => {
  return {
    boardId: item.board_id,
    name: item.name,
    color: item.color,
    description: item.description,
    createdAt: dayjs(item.created_at),
    members: toRecord(item.members.map(toMember), 'userId'),
  }
}

export const list = ({ pageIndex, pageSize } = { pageIndex: 0, pageSize: 100 }): Promise<PaginatedResponse<Board>> => {
  return axios
    .get(`${endpoints.board.list}?${querystring.stringify({ 'page-index': pageIndex, 'page-size': pageSize })}`)
    .then(resp => ({
      pageIndex: resp.data.page_index,
      pageSize: resp.data.page_size,
      count: resp.data.count,
      data: toRecord(resp.data.data.map(toBoard), 'boardId'),
    }))
}
