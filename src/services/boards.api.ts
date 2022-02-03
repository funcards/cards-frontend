import { Board, DraftBoard, PaginatedResponse } from '@/types';

import { Api } from '.';

export class BoardsApi {
  public static list(): Promise<PaginatedResponse<Board>> {
    return Api.read('/boards');
  }

  public static one(board_id: string): Promise<Board> {
    return Api.read(`/boards/${board_id}`);
  }

  public static create(payload: DraftBoard): Promise<string> {
    return Api.create('/boards', payload);
  }

  public static update({ board_id, ...payload }: Partial<Board> & Pick<Board, 'board_id'>): Promise<void> {
    return Api.update(`/boards/${board_id}`, payload);
  }

  public static delete(board_id: string): Promise<void> {
    return Api.delete(`/boards/${board_id}`);
  }
}
