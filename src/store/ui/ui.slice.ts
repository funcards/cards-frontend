import { createSlice } from '@reduxjs/toolkit';

export type UiState = {
  addBoardDialogIsOpened: boolean;
  boardMenuIsOpened: boolean;
  tagsLabelIsOpened: boolean;
};

const initialState: UiState = {
  addBoardDialogIsOpened: false,
  boardMenuIsOpened: false,
  tagsLabelIsOpened: false,
};

const slice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    openAddBoard: (state: UiState) => {
      state.addBoardDialogIsOpened = true;
    },
    closeAddBoard: (state: UiState) => {
      state.addBoardDialogIsOpened = false;
    },
    openBoardMenu: (state: UiState) => {
      state.boardMenuIsOpened = true;
    },
    closeBoardMenu: (state: UiState) => {
      state.boardMenuIsOpened = false;
    },
    toggleTagsLabel: (state: UiState) => {
      state.tagsLabelIsOpened = !state.tagsLabelIsOpened;
    },
    clearUi: () => initialState,
  },
});

export default slice.reducer;

export const { openAddBoard, closeAddBoard, openBoardMenu, closeBoardMenu, toggleTagsLabel, clearUi } = slice.actions;
