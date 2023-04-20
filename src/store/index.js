import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { mockupReducer, productReducer } from './slices'
// import { productsSaga } from "./sagas";

// Create a root saga that combines all your sagas
function* rootSaga() {
    yield all([
        // productsSaga()
    ])
}

// Create a saga middleware
const sagaMiddleware = createSagaMiddleware()

// Create the Redux store with the reducer and middleware
const store = configureStore({
    reducer: {
        product: productReducer,
        mockup: mockupReducer
    },
    // Add the saga middleware to the default middleware list
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
})

// Run the root saga
sagaMiddleware.run(rootSaga)

export default store
