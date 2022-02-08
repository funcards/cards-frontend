import { takeLatest, call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import {
  DELETE_TAG,
  EDIT_TAG,
  fulfilledTags,
  NEW_TAG,
  pendingTags,
  rejectedTags, removeTag,
  selectBoardTag,
  setTag,
  setTags
} from '@/store';
import { DraftTag, Tag } from '@/types';
import { TagsApi } from '@/services';
import { caughtWorker, successWorker } from '@/store/notifications/notifications.saga';
import { noUndefined } from '@/helpers';
import { createPayload } from '@/store/helpers';

export function* loadTagsWorker({ payload }: PayloadAction<string>) {
  const { data } = yield call(TagsApi.list, payload);
  yield put(setTags(data));
}

function* loadTagWorker({ payload: { board_id, tag_id } }: PayloadAction<Pick<Tag, 'board_id' | 'tag_id'>>) {
  const tag: Tag = yield call(TagsApi.one, board_id, tag_id);
  yield put(setTag(tag));
}

function* newTagWorker({ payload }: PayloadAction<DraftTag>) {
  const { board_id } = payload;

  try {
    yield put(pendingTags());

    const tag_id: string = yield call(TagsApi.create, payload);
    yield call(loadTagWorker, createPayload({ board_id, tag_id }));

    yield call(successWorker, `Tag "${payload.name}" added successfully.`);
    yield put(fulfilledTags());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedTags());
  }
}

function* editTagWorker({ payload }: PayloadAction<Partial<Tag> & Pick<Tag, 'board_id' | 'tag_id'>>) {
  const { board_id, tag_id, ...data } = payload;
  const tag: Tag | undefined = yield select(selectBoardTag, { board_id, tag_id });
  if (!tag) {
    return;
  }

  const oldTag = JSON.parse(JSON.stringify(tag));

  try {
    yield put(pendingTags());
    yield put(setTag({ ...tag, ...noUndefined(data) }));
    yield call(TagsApi.update, payload);
    yield call(successWorker, `Tag "${payload.name}" updated successfully.`);
    yield put(fulfilledTags());
  } catch (e) {
    yield put(setTag(oldTag));
    yield call(caughtWorker, e);
    yield put(rejectedTags());
  }
}

function* deleteTagWorker({ payload }: PayloadAction<Pick<Tag, 'board_id' | 'tag_id'>>) {
  try {
    yield put(pendingTags());
    yield call(TagsApi.delete, payload.board_id, payload.tag_id);
    yield put(removeTag(payload));
    yield put(fulfilledTags());
  } catch (e) {
    yield call(caughtWorker, e);
    yield put(rejectedTags());
  }
}

export function* tagsWatcher() {
  yield takeLatest(NEW_TAG, newTagWorker);
  yield takeLatest(EDIT_TAG, editTagWorker);
  yield takeLatest(DELETE_TAG, deleteTagWorker);
}
