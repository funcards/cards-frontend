import { configureStore, ThunkAction, Action, createSelector } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { isProduction } from '@/config';
import { Card, Category, Tag } from '@/types';

import uiReducer from './ui/ui.slice';
import notificationsReducer from './notifications/notifications.slice';
import authReducer from './auth/auth.slice';
import boardsReducer from './boards/boards.slice';
import categoriesReducer from './categories/categories.slice';
import tagsReducer from './tags/tags.slice';
import cardsReducer from './cards/cards.slice';
import { rootWatcher } from './root.saga';

export * from './ui/ui.slice';
export * from './notifications/notifications.slice';
export * from './auth/auth.slice';
export * from './boards/boards.slice';
export * from './categories/categories.slice';
export * from './tags/tags.slice';
export * from './cards/cards.slice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    notifications: notificationsReducer,
    auth: authReducer,
    boards: boardsReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    cards: cardsReducer,
  },
  middleware: (getDefaultMiddleware) => [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: !isProduction,
});

sagaMiddleware.run(rootWatcher);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const selectUi = (state: RootState) => state.ui;
export const selectNotifications = (state: RootState) => state.notifications;
export const selectAuth = (state: RootState) => state.auth;
export const selectBoards = (state: RootState) => state.boards;
export const selectCategories = (state: RootState) => state.categories;
export const selectTags = (state: RootState) => state.tags;
export const selectCards = (state: RootState) => state.cards;

const selectBoardId = (state: RootState, board_id: string) => board_id;
const selectBoardIdAndCategoryId = (state: RootState, ids: { board_id: string; category_id: string }) => ids;
const selectBoardIdAndTagId = (state: RootState, ids: { board_id: string; tag_id: string }) => ids;
const selectBoardIdAndCardId = (state: RootState, ids: { board_id: string; card_id: string }) => ids;
const selectBoardIdAndTagsId = (state: RootState, ids: { board_id: string; tags_id: string[] }) => ids;

const defaultCards: Card[] = [];
const defaultCategories: Category[] = [];
const defaultTags: Tag[] = [];

export const selectBoard = createSelector([selectBoards, selectBoardId], (state, board_id) =>
  state.boards.find((b) => b.board_id === board_id)
);
export const selectBoardCategories = createSelector(
  [selectCategories, selectBoardId],
  (state, board_id) => state.categories[board_id] || defaultCategories
);
export const selectBoardTags = createSelector(
  [selectTags, selectBoardIdAndTagsId],
  (state, { board_id, tags_id }) => state.tags[board_id]?.filter((t) => tags_id.indexOf(t.tag_id) > -1) || defaultTags
);
export const selectBoardCards = createSelector(
  [selectCards, selectBoardId],
  (state, board_id) => state.cards[board_id] || defaultCards
);
export const selectCategoryCards = createSelector(
  [selectCards, selectBoardIdAndCategoryId],
  (state, { board_id, category_id }) =>
    state.cards[board_id]?.filter((c) => c.category_id === category_id) || defaultCards
);
export const selectBoardCategory = createSelector(
  [selectCategories, selectBoardIdAndCategoryId],
  (state, { board_id, category_id }) => state.categories[board_id]?.find((c) => c.category_id === category_id)
);
export const selectBoardTag = createSelector([selectTags, selectBoardIdAndTagId], (state, { board_id, tag_id }) =>
  state.tags[board_id]?.find((t) => t.tag_id === tag_id)
);
export const selectBoardCard = createSelector([selectCards, selectBoardIdAndCardId], (state, { board_id, card_id }) =>
  state.cards[board_id]?.find((c) => c.card_id === card_id)
);
