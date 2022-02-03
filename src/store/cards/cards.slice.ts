import { RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';
import { createAction, PayloadAction } from '@reduxjs/toolkit';

import { Card, ChangeCardsPosition, DraftCard } from '@/types';
import { createGenericSlice, flagsInitialState } from '@/store/createGeneric.slice';
import { groupBy, swap } from '@/helpers';

const sort = (a: Card, b: Card) => a.position - b.position;

export type CardsState = RequestStatusFlags & {
  cards: Record<string, Card[]>;
};

const initialState: CardsState = {
  cards: {},
  ...flagsInitialState,
};

const slice = createGenericSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state: CardsState, { payload }: PayloadAction<Card[]>) => {
      state.cards = { ...state.cards, ...groupBy(payload.sort(sort), 'board_id') };
    },
    setCard: (state: CardsState, { payload }: PayloadAction<Card>) => {
      const cards = (state.cards[payload.board_id] || []).filter((c) => c.card_id !== payload.card_id);
      cards.push(payload);
      state.cards[payload.board_id] = cards.sort(sort);
    },
    setCardsPosition: (
      state: CardsState,
      { payload: { board_id, source, destination } }: PayloadAction<ChangeCardsPosition>
    ) => {
      state.cards[board_id] = swap(state.cards[board_id], source.index, destination.index).map((c, i) => ({
        ...c,
        position: i,
      }));
      state.cards[board_id][destination.index].category_id = destination.category_id;
    },
  },
});

export default slice.reducer;

export const {
  pending: pendingCards,
  fulfilled: fulfilledCards,
  rejected: rejectedCards,
  clear: clearCards,
  setCards,
  setCard,
  setCardsPosition,
} = slice.actions;

export const NEW_CARD = 'NEW_CARD';
export const EDIT_CARD = 'EDIT_CARD';
export const CHANGE_CARDS_POSITION = 'CHANGE_CARDS_POSITION';

export const newCard = createAction<DraftCard>(NEW_CARD);
export const editCard = createAction<Partial<Card> & Pick<Card, 'board_id' | 'card_id'>>(EDIT_CARD);
export const changeCardsPosition = createAction<ChangeCardsPosition>(CHANGE_CARDS_POSITION);
