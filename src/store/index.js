import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import config from './config'
const reducer = combineReducers({
    config,
})
const store = configureStore({
    reducer,
})
export default store;