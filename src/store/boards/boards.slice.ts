import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { QueryStatus, RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';
import dayjs from 'dayjs';

import { Board, DraftBoard } from '@/types';
import { flagsInitialState, createGenericSlice } from '@/store/createGeneric.slice';

const sort = (a: Board, b: Board) => dayjs(a.created_at).diff(b.created_at);

export type BoardsState = RequestStatusFlags & {
  boards: Board[];
  loadedAll: boolean
  loading: QueryStatus;
};

const initialState: BoardsState = {
  boards: [],
  loadedAll: false,
  loading: QueryStatus.uninitialized,
  ...flagsInitialState,
};

const slice = createGenericSlice({
  name: 'boards',
  initialState,
  reducers: {
    boardsLoad: (state: BoardsState) => {
      state.loading = QueryStatus.pending;
    },
    boardLoad: (state: BoardsState, {}: PayloadAction<string>) => {
      state.loading = QueryStatus.pending;
    },
    fulfilledLoad: (state: BoardsState) => {
      state.loading = QueryStatus.fulfilled;
    },
    rejectedLoad: (state: BoardsState) => {
      state.loading = QueryStatus.rejected;
    },
    setBoards: (state: BoardsState, { payload }: PayloadAction<Board[]>) => {
      state.loadedAll = true;
      state.boards = payload.sort(sort).reverse();
    },
    setBoard: (state: BoardsState, { payload }: PayloadAction<Board>) => {
      state.boards = [...state.boards.filter((b: Board) => b.board_id !== payload.board_id), payload]
        .sort(sort)
        .reverse();
    },
  },
});

export default slice.reducer;

export const {
  pending: pendingBoards,
  fulfilled: fulfilledBoards,
  rejected: rejectedBoards,
  clear: clearBoards,
  boardsLoad,
  boardLoad,
  fulfilledLoad,
  rejectedLoad,
  setBoards,
  setBoard,
} = slice.actions;

export const NEW_BOARD = 'NEW_BOARD';
export const EDIT_BOARD = 'EDIT_BOARD';

export const newBoard = createAction<DraftBoard>(NEW_BOARD);
export const editBoard = createAction<Partial<Board> & Pick<Board, 'board_id'>>(EDIT_BOARD);
