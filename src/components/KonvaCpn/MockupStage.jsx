import React, { useEffect, useRef } from 'react'
import { Stage } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { changeRatio, changeSelectedLayer, changeStageObject, createStageRefBySide, selectMockup } from '../../store/slices'
import MockupLayers from './layers'

const MockupStage = ({ stage, isActive, activeSide }) => {

    const { selectedLayer, stageComponent, stageDrag } = useSelector(selectMockup)
    const dispatch = useDispatch()

    const { ratio, layers, background, side } = stage

    const stageRef = useRef(null)

    useEffect(() => {
        if (activeSide === 'All') return
        if (stageRef.current && side) {
            dispatch(createStageRefBySide(stageRef.current, side))
        }
    }, [activeSide, dispatch, side])

    /**
     * Detaches the currently selected layer if the clicked position is empty
     * @param {MouseEvent} e - The mouse event
     */
    const onDeAttach = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
            dispatch(changeSelectedLayer(null))
        }
    }

    /**
     * Zoom in or out based on mouse wheel event
     * @param {MouseEvent} e - The mouse event
     */
    const onZoom = (e) => {
        if (!ratio || activeSide === 'All') return
        const stage = stageRef.current
        // Get the amount of wheel movement
        const { deltaY } = e.evt

        // Get the current position of the mouse pointer on the stage
        const pointer = stage.getPointerPosition()

        const scaleFactor = deltaY < 0 ? 1.1 : 1 / 1.1

        const newRadio = ratio * scaleFactor
        if (newRadio < 0.05 || newRadio > 2) return

        // Calculate the new scale
        const newScaleX = stage.scaleX() * scaleFactor
        const newScaleY = stage.scaleY() * scaleFactor

        // Calculate the new position of the stage based on the current position of the mouse pointer
        const newX = pointer.x - (pointer.x - stage.x()) * scaleFactor
        const newY = pointer.y - (pointer.y - stage.y()) * scaleFactor

        dispatch(changeRatio({ ratio: newRadio }))

        dispatch(
            changeStageObject({
                scaleX: newScaleX,
                scaleY: newScaleY,
                x: newX,
                y: newY,
            })
        )
    }

    useEffect(() => {
        if (activeSide === 'All') return
        const stage = stageRef.current
        stage.scale({ x: stageComponent.scaleX, y: stageComponent.scaleY })
        stage.position({ x: stageComponent.x, y: stageComponent.y })
        stage.batchDraw()
    }, [activeSide, stageComponent, stageRef])

    return (
        <Stage
            ref={stageRef}
            width={stageComponent.width}
            height={stageComponent.height}
            onClick={onDeAttach}
            draggable={stageDrag}
            onWheel={onZoom}
            style={{ display: isActive ? 'block' : 'none' }}
        >
            {background && (
                <MockupLayers
                    layers={layers}
                    draggable={stageDrag}
                    background={background}
                    selectedLayer={selectedLayer}
                    dispatch={dispatch}
                />
            )}
        </Stage>
    )
}

export default MockupStage

