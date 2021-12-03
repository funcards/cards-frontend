import { createSelector } from '@reduxjs/toolkit'

import { userAdapter } from './user.slice'

import { RootState } from '~src/store'

const selectSateUser = (state: RootState) => state.user

export const getUsers = createSelector([selectSateUser], (state) => userAdapter.getSelectors().selectEntities(state))
