import { Tag, DraftTag, PaginatedResponse } from '@/types';

import { Api } from '.';

export class TagsApi {
  public static list(board_id: string): Promise<PaginatedResponse<Tag>> {
    return Api.read(`/boards/${board_id}/tags`);
  }

  public static one(board_id: string, tag_id: string): Promise<Tag> {
    return Api.read(`/boards/${board_id}/tags/${tag_id}`);
  }

  public static create({ board_id, ...payload }: DraftTag): Promise<string> {
    return Api.create(`/boards/${board_id}/tags`, payload);
  }

  public static update({
    board_id,
    tag_id,
    ...payload
  }: Partial<Tag> & Pick<Tag, 'board_id' | 'tag_id'>): Promise<void> {
    return Api.update(`/boards/${board_id}/tags/${tag_id}`, payload);
  }

  public static delete(board_id: string, tag_id: string): Promise<void> {
    return Api.delete(`/boards/${board_id}/tags/${tag_id}`);
  }
}
