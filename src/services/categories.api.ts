import { Category, DraftCategory, PaginatedResponse } from '@/types';

import { Api } from '.';

export class CategoriesApi {
  public static list(board_id: string): Promise<PaginatedResponse<Category>> {
    return Api.read(`/boards/${board_id}/categories`);
  }

  public static one(board_id: string, category_id: string): Promise<Category> {
    return Api.read(`/boards/${board_id}/categories/${category_id}`);
  }

  public static create({ board_id, ...payload }: DraftCategory): Promise<string> {
    return Api.create(`/boards/${board_id}/categories`, payload);
  }

  public static update({
    board_id,
    category_id,
    ...payload
  }: Partial<Category> & Pick<Category, 'board_id' | 'category_id'>): Promise<void> {
    return Api.update(`/boards/${board_id}/categories/${category_id}`, payload);
  }

  public static batchUpdate(board_id: string, data: { category_id: string; position: number }[]): Promise<void> {
    return Api.update(`/boards/${board_id}/categories`, data);
  }

  public static delete(board_id: string, category_id: string): Promise<void> {
    return Api.delete(`/boards/${board_id}/categories/${category_id}`);
  }
}
