import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  CHANGE_CARDS_POSITION,
  EDIT_CARD,
  fulfilledCards,
  NEW_CARD,
  pendingCards,
  rejectedCards,
  selectBoardCard,
  selectBoardCards,
  setCard,
  setCards,
  setCardsPosition,
} from '@/store';
import { Card, ChangeCardsPosition, DraftCard, PaginatedResponse } from '@/types';
import { CardsApi } from '@/services';
import { caughtWorker, successWorker } from '@/store/notifications/notifications.saga';
import { noUndefined } from '@/helpers';
import { createPayload } from '@/store/helpers';

export function* loadCardsWorker({ payload }: PayloadAction<string>) {
  const cards = [];
  let count = 0;

  do {
    const response: PaginatedResponse<Card> = yield call(CardsApi.list, payload);
    count = response.count;
    cards.push(...response.data);
  } while (cards.length < count);

  yield put(setCards(cards));
}

function* loadCardWorker({ payload: { board_id, card_id } }: PayloadAction<Pick<Card, 'board_id' | 'card_id'>>) {
  const card: Card = yield call(CardsApi.one, board_id, card_id);
  yield put(setCard(card));
}

function* newCardWorker({ payload }: PayloadAction<DraftCard>) {
  const { board_id } = payload;

  try {
    yield put(pendingCards());

    const card_id: string = yield call(CardsApi.create, payload);
    yield call(loadCardWorker, createPayload({ board_id, card_id }));

    yield call(successWorker, `Card "${payload.name}" added successfully.`);
    yield put(fulfilledCards());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedCards());
  }
}

function* editCardWorker({ payload }: PayloadAction<Partial<Card> & Pick<Card, 'board_id' | 'card_id'>>) {
  const { board_id, card_id, ...data } = payload;
  const card: Card | undefined = yield select(selectBoardCard, { board_id, card_id });
  if (!card) {
    return;
  }

  const oldCard = JSON.parse(JSON.stringify(card));
  const name = payload.name || card.name;

  try {
    yield put(pendingCards());
    yield put(setCard({ ...card, ...noUndefined(data) }));
    yield call(CardsApi.update, payload);
    yield call(successWorker, `Card "${name}" updated successfully.`);
    yield put(fulfilledCards());
  } catch (e) {
    yield put(setCard(oldCard));
    yield call(caughtWorker, e);
    yield put(rejectedCards());
  }
}

function* changeCardsPositionWorker({ payload }: PayloadAction<ChangeCardsPosition>) {
  const { board_id, source, destination } = payload;

  try {
    yield put(setCardsPosition(payload));
    const cards: Card[] = yield select(selectBoardCards, board_id);
    const data = cards.map((c, index) => {
      if (destination.index === index && source.category_id !== destination.category_id) {
        return { card_id: c.card_id, category_id: destination.category_id, position: c.position };
      }

      return { card_id: c.card_id, position: c.position };
    });
    yield call(CardsApi.batchUpdate, board_id, data);
  } catch (e) {
    yield put(setCardsPosition({ board_id, source: destination, destination: source }));
    yield call(caughtWorker, e);
  }
}

export function* cardsWatcher() {
  yield takeLatest(NEW_CARD, newCardWorker);
  yield takeLatest(EDIT_CARD, editCardWorker);
  yield takeEvery(CHANGE_CARDS_POSITION, changeCardsPositionWorker);
}
