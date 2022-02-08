import { RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';
import { createAction, PayloadAction } from '@reduxjs/toolkit';

import { Tag, DraftTag } from '@/types';
import { createGenericSlice, flagsInitialState } from '@/store/createGeneric.slice';
import { groupBy } from '@/helpers';

export type TagsState = RequestStatusFlags & {
  tags: Record<string, Tag[]>;
};

const initialState: TagsState = {
  tags: {},
  ...flagsInitialState,
};

const slice = createGenericSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state: TagsState, { payload }: PayloadAction<Tag[]>) => {
      state.tags = { ...state.tags, ...groupBy(payload, 'board_id') };
    },
    setTag: (state: TagsState, { payload }: PayloadAction<Tag>) => {
      (state.tags[payload.board_id] = (state.tags[payload.board_id] || []).filter(
        (t) => t.tag_id !== payload.tag_id
      )).push(payload);
    },
    removeTag: (state: TagsState, { payload }: PayloadAction<Pick<Tag, 'board_id' | 'tag_id'>>) => {
      state.tags[payload.board_id] = (state.tags[payload.board_id] || []).filter((t) => t.tag_id !== payload.tag_id);
    },
  },
});

export default slice.reducer;

export const {
  pending: pendingTags,
  fulfilled: fulfilledTags,
  rejected: rejectedTags,
  clear: clearTags,
  setTags,
  setTag,
  removeTag,
} = slice.actions;

export const NEW_TAG = 'NEW_TAG';
export const EDIT_TAG = 'EDIT_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export const newTag = createAction<DraftTag>(NEW_TAG);
export const editTag = createAction<Partial<Tag> & Pick<Tag, 'board_id' | 'tag_id'>>(EDIT_TAG);
export const deleteTag = createAction<Pick<Tag, 'board_id' | 'tag_id'>>(DELETE_TAG);
