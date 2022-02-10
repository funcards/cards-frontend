import { RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';
import { createAction, PayloadAction } from '@reduxjs/toolkit';

import { Category, ChangeCategoriesPosition, DraftCategory } from '@/types';
import { createGenericSlice, flagsInitialState } from '@/store/createGeneric.slice';
import { groupBy, swap } from '@/helpers';

const sort = (a: Category, b: Category) => a.position - b.position;

export type CategoriesState = RequestStatusFlags & {
  categories: Record<string, Category[]>;
};

const initialState: CategoriesState = {
  categories: {},
  ...flagsInitialState,
};

const slice = createGenericSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state: CategoriesState, { payload }: PayloadAction<Category[]>) => {
      state.categories = { ...state.categories, ...groupBy(payload.sort(sort), 'board_id') };
    },
    setCategory: (state: CategoriesState, { payload }: PayloadAction<Category>) => {
      const categories = (state.categories[payload.board_id] || []).filter(
        (c) => c.category_id !== payload.category_id
      );
      categories.push(payload);
      state.categories[payload.board_id] = categories.sort(sort);
    },
    removeCategory: (state: CategoriesState, { payload }: PayloadAction<Pick<Category, 'board_id' | 'category_id'>>) => {
      state.categories[payload.board_id] = (state.categories[payload.board_id] || []).filter(
        (c) => c.category_id !== payload.category_id
      );
    },
    setCategoriesPosition: (
      state: CategoriesState,
      { payload: { board_id, source, destination } }: PayloadAction<ChangeCategoriesPosition>
    ) => {
      state.categories[board_id] = swap(state.categories[board_id], source, destination).map((c, i) => ({
        ...c,
        position: i,
      }));
    },
  },
});

export default slice.reducer;

export const {
  pending: pendingCategories,
  fulfilled: fulfilledCategories,
  rejected: rejectedCategories,
  clear: clearCategories,
  setCategories,
  setCategory,
  removeCategory,
  setCategoriesPosition,
} = slice.actions;

export const NEW_CATEGORY = 'NEW_CATEGORY';
export const EDIT_CATEGORY = 'EDIT_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CHANGE_CATEGORIES_POSITION = 'CHANGE_CATEGORIES_POSITION';

export const newCategory = createAction<DraftCategory>(NEW_CATEGORY);
export const editCategory = createAction<Partial<Category> & Pick<Category, 'board_id' | 'category_id'>>(EDIT_CATEGORY);
export const deleteCategory = createAction<Pick<Category, 'board_id' | 'category_id'>>(DELETE_CATEGORY);
export const changeCategoriesPosition = createAction<ChangeCategoriesPosition>(CHANGE_CATEGORIES_POSITION);
