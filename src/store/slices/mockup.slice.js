import { createSlice } from '@reduxjs/toolkit'

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

const mockupSlice = createSlice({
    name: 'mockup',
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
    }
})

// Actions
export const {
    changeSelectedLayer,
    changeStageObject,
    changeRatio,
    createStageRefBySide,
    updateLayerAttrs,
    removeLayer,
    actionUndo,
    updateStageObject,
    updateBackground,
    createStageSide,
    uploadImageLayer,
    addTextLayer,
    changeActiveSide,
    changeActiveProduct,
    changeActiveCampaign,
    moveItemInLayer,
    duplicateLayer,
    createAreas,
    createArtworks
} = mockupSlice.actions

// Selectors
export const selectMockup = (state) => state.mockup

// Reducer
export const mockupReducer = mockupSlice.reducer
