import { combineReducers } from '@reduxjs/toolkit'
import { accountReducer } from '../reducers'
const rootReducer = combineReducers({
    accountState: accountReducer,
})
export default rootReducer