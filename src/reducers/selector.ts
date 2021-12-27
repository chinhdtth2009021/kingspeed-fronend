import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../app/store'
export const selectAccount = (state: RootState) => state.accountState
export const authSelector = createSelector(selectAccount, state => state)