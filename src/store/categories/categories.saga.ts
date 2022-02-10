import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  setCategory,
  setCategories,
  NEW_CATEGORY,
  EDIT_CATEGORY,
  pendingCategories,
  fulfilledCategories,
  rejectedCategories,
  selectBoardCategory,
  CHANGE_CATEGORIES_POSITION,
  setCategoriesPosition,
  selectBoardCategories,
  removeCategory,
  DELETE_CATEGORY,
} from '@/store';
import { Category, ChangeCategoriesPosition, DraftCategory } from '@/types';
import { CategoriesApi } from '@/services';
import { caughtWorker, successWorker } from '@/store/notifications/notifications.saga';
import { noUndefined } from '@/helpers';
import { createPayload } from '@/store/helpers';

export function* loadCategoriesWorker({ payload }: PayloadAction<string>) {
  const { data } = yield call(CategoriesApi.list, payload);
  yield put(setCategories(data));
}

function* loadCategoryWorker({
  payload: { board_id, category_id },
}: PayloadAction<Pick<Category, 'board_id' | 'category_id'>>) {
  const category: Category = yield call(CategoriesApi.one, board_id, category_id);
  yield put(setCategory(category));
}

function* newCategoryWorker({ payload }: PayloadAction<DraftCategory>) {
  const { board_id } = payload;

  try {
    yield put(pendingCategories());

    const category_id: string = yield call(CategoriesApi.create, payload);
    yield call(loadCategoryWorker, createPayload({ board_id, category_id }));

    yield call(successWorker, `Category "${payload.name}" added successfully.`);
    yield put(fulfilledCategories());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedCategories());
  }
}

function* editCategoryWorker({
  payload,
}: PayloadAction<Partial<Category> & Pick<Category, 'board_id' | 'category_id'>>) {
  const { board_id, category_id, ...data } = payload;
  const category: Category | undefined = yield select(selectBoardCategory, { board_id, category_id });
  if (!category) {
    return;
  }

  const oldCategory = JSON.parse(JSON.stringify(category));
  const name = payload.name || category.name;

  try {
    yield put(pendingCategories());
    yield put(setCategory({ ...category, ...noUndefined(data) }));
    yield call(CategoriesApi.update, payload);
    yield call(successWorker, `Category "${name}" updated successfully.`);
    yield put(fulfilledCategories());
  } catch (e) {
    yield put(setCategory(oldCategory));
    yield call(caughtWorker, e);
    yield put(rejectedCategories());
  }
}

function* deleteCategoryWorker({ payload }: PayloadAction<Pick<Category, 'board_id' | 'category_id'>>) {
  const { board_id, category_id } = payload;
  const category: Category | undefined = yield select(selectBoardCategory, { board_id, category_id });
  if (!category) {
    return;
  }

  try {
    yield put(pendingCategories());
    yield call(CategoriesApi.delete, board_id, category_id);
    yield put(removeCategory(payload));
    yield call(successWorker, `Category "${category.name}" deleted successfully.`);
    yield put(fulfilledCategories());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedCategories());
  }
}

function* changeCategoriesPositionWorker({ payload }: PayloadAction<ChangeCategoriesPosition>) {
  const { board_id, source, destination } = payload;

  try {
    yield put(setCategoriesPosition(payload));
    const categories: Category[] = yield select(selectBoardCategories, board_id);
    const data = categories.map((c) => ({ category_id: c.category_id, position: c.position }));
    yield call(CategoriesApi.batchUpdate, board_id, data);
  } catch (e) {
    yield put(setCategoriesPosition({ board_id, source: destination, destination: source }));
    yield call(caughtWorker, e);
  }
}

export function* categoriesWatcher() {
  yield takeLatest(NEW_CATEGORY, newCategoryWorker);
  yield takeLatest(EDIT_CATEGORY, editCategoryWorker);
  yield takeLatest(DELETE_CATEGORY, deleteCategoryWorker);
  yield takeEvery(CHANGE_CATEGORIES_POSITION, changeCategoriesPositionWorker);
}
