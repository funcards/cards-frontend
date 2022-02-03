import { Card, DraftCard, PaginatedResponse } from '@/types';

import { Api } from '.';

export class CardsApi {
  public static list(board_id: string): Promise<PaginatedResponse<Card>> {
    return Api.read(`/boards/${board_id}/cards`);
  }

  public static one(board_id: string, card_id: string): Promise<Card> {
    return Api.read(`/boards/${board_id}/cards/${card_id}`);
  }

  public static create({ board_id, ...payload }: DraftCard): Promise<string> {
    return Api.create(`/boards/${board_id}/cards`, payload);
  }

  public static update({
    board_id,
    card_id,
    ...payload
  }: Partial<Card> & Pick<Card, 'board_id' | 'card_id'>): Promise<void> {
    return Api.update(`/boards/${board_id}/cards/${card_id}`, payload);
  }

  public static batchUpdate(
    board_id: string,
    data: { card_id: string; position: number; category_id?: string }[]
  ): Promise<void> {
    return Api.update(`/boards/${board_id}/cards`, data);
  }

  public static delete(board_id: string, card_id: string): Promise<void> {
    return Api.delete(`/boards/${board_id}/cards/${card_id}`);
  }
}
