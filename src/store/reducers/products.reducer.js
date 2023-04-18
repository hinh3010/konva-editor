import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getAllProducts = createAsyncThunk('get_all_products', async (payload) => {
    // const response = await classApi.getAll(payload)
    // return response
})

const initialState = {
    isLoggedIn: false,
    logging: false,
    currentUser: undefined
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    // handle ko call api
    reducers: {
        login(state, action) {
            state.logging = true
        },
        loginSuccess(state, action) {
            state.isLoggedIn = true
            state.logging = false
            state.currentUser = action.payload
        },
        loginFailed(state, action) {
            state.logging = false
        },

        logout(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        }
    },
    // handle call api
    extraReducers: {
        [getAllProducts.pending]: (state) => {
            state.pending = true
        },
        [getAllProducts.fulfilled]: (state, action) => {
            state.pending = false
            state.success = true
            state.message = ''
            state.docs = action.payload?.docs
            state.totalDocs = action.payload?.totalDocs
        },
        [getAllProducts.rejected]: (state, action) => {
            state.pending = false
            state.success = false
            state.message = action?.error?.message
        }
    }
})

// Actions
export const productsActions = productsSlice.actions

// Selectors
export const selectIsLoggedIn = (state) => state.products.isLoggedIn
export const selectIsLogging = (state) => state.products.logging

// Reducer
export const productsReducer = productsSlice.reducer
