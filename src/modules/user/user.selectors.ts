import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '~src/store'
import { userAdapter } from './user.slice'

const selectSateUser = (state: RootState) => state.user

export const getUsers = createSelector(
  [selectSateUser],
  (state) => userAdapter.getSelectors().selectEntities(state),
)

export const getMe = createSelector([selectSateUser], (state) => state.currentUser)
