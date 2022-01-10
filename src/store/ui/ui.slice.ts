import { createSlice } from '@reduxjs/toolkit'

import { UiState } from './ui.types'

const initialState: UiState = {
  addBoardDialogIsOpened: false,
  boardMenuIsOpened: false,
  tagsLabelIsOpened: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddBoard: (state: UiState) => {
      state.addBoardDialogIsOpened = true
    },
    closeAddBoard: (state: UiState) => {
      state.addBoardDialogIsOpened = false
    },
    openBoardMenu: (state: UiState) => {
      state.boardMenuIsOpened = true
    },
    closeBoardMenu: (state: UiState) => {
      state.boardMenuIsOpened = false
    },
    toggleTagsLabel: (state: UiState) => {
      state.tagsLabelIsOpened = !state.tagsLabelIsOpened
    },
    clearUi: () => initialState,
  },
})

export const { openAddBoard, closeAddBoard, openBoardMenu, closeBoardMenu, toggleTagsLabel, clearUi } = uiSlice.actions
export default uiSlice.reducer
