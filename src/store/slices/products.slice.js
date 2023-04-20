import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getAllProducts = createAsyncThunk('get_all_product', async (payload) => {
    // const response = await classApi.getAll(payload)
    // return response
})

const initialState = {
    pending: false,

    activeSide: 'front',
    productIdActive: null,
    campaignIdActive: null,
    selectedLayer: null,

    stageObject: {
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        drag: false
    },

    stageSides: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    // handle ko call api
    reducers: {
        changeSelectedLayer(state, { payload: layer }) {
            state.logging = true
        },
        removeLayer(state, { payload: layerId }) {
            state.isLoggedIn = true
            state.logging = false
        },
        actionUndo(state, action) {
            state.logging = false
        },
        updateStageObject(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        updateBackground(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        changeStageObject(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        createStageSide(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        uploadImageLayer(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        addTextLayer(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        changeRatio(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        updateLayerAttrs(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        changeActiveSide(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        changeActiveProduct(state) {
            state.isLoggedIn = false
        },
        changeActiveCampaign(state) {
            state.isLoggedIn = false
        },
        moveItemInLayer(state) {
            state.isLoggedIn = false
        },
        duplicateLayer(state) {
            state.isLoggedIn = false
            state.currentUser = undefined
        },
        createStageRefBySide(state) {
            state.isLoggedIn = false
        },
        createAreas(state) {
            state.isLoggedIn = false
        },
        createArtworks(state) {
            state.isLoggedIn = false
        }
    },
    // handle call api
    extraReducers: {
        [getAllProducts.pending]: (state) => {
            state.pending = true
        },
        [getAllProducts.fulfilled]: (state) => {
            state.pending = false
        },
        [getAllProducts.rejected]: (state, action) => {
            state.pending = false
            // action?.error?.message
        }
    }
})

// Actions
export const productActions = productSlice.actions

// Selectors
export const selectIsLoggedIn = (state) => state.product.isLoggedIn
export const selectIsLogging = (state) => state.product.logging

// Reducer
export const productReducer = productSlice.reducer
