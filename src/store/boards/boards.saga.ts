import { takeLatest, call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { caughtWorker, successWorker } from '@/store/notifications/notifications.saga';
import {
  closeAddBoard,
  EDIT_BOARD,
  fulfilledBoards,
  fulfilledLoad,
  boardsLoad,
  boardLoad,
  NEW_BOARD,
  pendingBoards,
  rejectedBoards,
  rejectedLoad,
  selectBoard,
  selectCards,
  selectCategories,
  selectTags,
  setBoard,
  setBoards,
} from '@/store';
import { BoardsApi } from '@/services';
import { Board, DraftBoard } from '@/types';
import { noUndefined } from '@/helpers';
import { createPayload } from '@/store/helpers';
import { loadCategoriesWorker } from '@/store/categories/categories.saga';
import { loadCardsWorker } from '@/store/cards/cards.saga';
import { loadTagsWorker } from '@/store/tags/tags.saga';

function* loadBoardsWorker() {
  try {
    const { data } = yield call(BoardsApi.list);
    yield put(setBoards(data));
    yield put(fulfilledLoad());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedLoad());
  }
}

function* loadBoardWorker({ payload }: PayloadAction<string>) {
  const board: Board = yield call(BoardsApi.one, payload);
  yield put(setBoard(board!));
}

function* loadFullBoardWorker(action: PayloadAction<string>) {
  const { payload } = action;

  try {
    const board: Board | undefined = yield select(selectBoard, payload);
    if (!board) {
      yield call(loadBoardWorker, action);
    }

    const { tags } = yield select(selectTags);
    if (!(payload in tags)) {
      yield call(loadTagsWorker, createPayload(payload));
    }

    const { categories } = yield select(selectCategories);
    if (!(payload in categories)) {
      yield call(loadCategoriesWorker, createPayload(payload));
    }

    const { cards } = yield select(selectCards);
    if (!(payload in cards)) {
      yield call(loadCardsWorker, createPayload(payload));
    }

    yield put(fulfilledLoad());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedLoad());
  }
}

function* newBoardWorker({ payload }: PayloadAction<DraftBoard>) {
  try {
    yield put(pendingBoards());

    const board_id: string = yield call(BoardsApi.create, payload);
    yield call(loadBoardWorker, createPayload(board_id));

    yield call(successWorker, `Board "${payload.name}" added successfully.`);
    yield put(fulfilledBoards());
    yield put(closeAddBoard());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedBoards());
  }
}

function* editBoardWorker({ payload }: PayloadAction<Partial<Board> & Pick<Board, 'board_id'>>) {
  const { board_id, ...data } = payload;
  const board: Board | undefined = yield select(selectBoard, board_id);
  if (!board) {
    return;
  }

  const oldBoard = JSON.parse(JSON.stringify(board));

  try {
    yield put(pendingBoards());
    yield put(setBoard({ ...board, ...noUndefined(data) }));
    yield call(BoardsApi.update, payload);
    yield call(successWorker, `Board "${payload.name}" updated successfully.`);
    yield put(fulfilledBoards());
  } catch (e) {
    yield put(setBoard(oldBoard));
    yield call(caughtWorker, e);
    yield put(rejectedBoards());
  }
}

export function* boardsWatcher() {
  yield takeLatest(boardsLoad.type, loadBoardsWorker);
  yield takeLatest(boardLoad.type, loadFullBoardWorker);
  yield takeLatest(NEW_BOARD, newBoardWorker);
  yield takeLatest(EDIT_BOARD, editBoardWorker);
}
