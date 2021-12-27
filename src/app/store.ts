import { Action, configureStore, ThunkAction, MiddlewareArray } from '@reduxjs/toolkit'
import { createLogger } 'redux-logger';
import rootReducer from './rootReducer'

const logger = createLogger( {
    predicate: () => process.env.NODE_ENV !== 'production',
})
const store = configureStore ( {
    devTools: process.env.NODE_ENV !== 'production',
reducer: rootReducer,
middleware: new MiddlewareArray ().concat(logger),
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction< ReturnType, RootState, unknown, Action<string>>
export default store 
