import { debounce } from 'lodash'
import React, { Fragment, useRef } from 'react'
import { Group, Layer } from 'react-konva'
import {
    actionChangeSelectedLayer,
    updateLayerAttribute
} from '../../../../context/MockupDesignContext/action'
import BackgroundLayer from './BackgroundLayer'
import ImageLayer from './ImageLayer'
import TextLayer from './TextLayer'
import { useEffect } from 'react'

const MockupLayers = ({
    draggable,
    background,
    selectedLayer,
    dispatch,
    layers,
    ratioDefault,
    side,
    activeSide
}) => {
    const onUpdateLayerAttr = (newAttrs) => {
        dispatch(updateLayerAttribute(newAttrs))
    }

    const groupRef = useRef(null)

    // useEffect(() => {
    //     if (!groupRef.current || (activeSide !== 'waistband' && side !== 'waistband')) return

    //     const group = groupRef.current

    //     const canvas = group.toCanvas({mimeType: 'image/png', pixelRatio: 1 / ratioDefault, callback : (canvas) => console.log({canvas})})
    //     canvas.toBlob((blob) => {
    //         const url = URL.createObjectURL(blob)
    //         const link2 = document.createElement('a')
    //         link2.href = url
    //         link2.download = side + '.png'
    //         document.body.appendChild(link2)
    //         link2.click()
    //         document.body.removeChild(link2)
    //     })

    // }, [ratioDefault, side, activeSide, background.width, background.height, background.x, background.y])

    useEffect(() => {
        const group = groupRef.current
        if (group) {
            group.on('dragmove', () => {
                const groupRect = group.getClientRect()
                const shapeRect = group.children[0].getClientRect()

                if (
                    shapeRect.x < groupRect.x ||
                    shapeRect.y < groupRect.y ||
                    shapeRect.x + shapeRect.width > groupRect.x + groupRect.width ||
                    shapeRect.y + shapeRect.height > groupRect.y + groupRect.height
                ) {
                    group.width(shapeRect.x + shapeRect.width - groupRect.x)
                    group.height(shapeRect.y + shapeRect.height - groupRect.y)
                }
            })
        }
    }, [])

    const handlerDragMove = () => {
        const group = groupRef.current
        if (!group) return
        const groupRect = group.getClientRect()
        const shapeRect = group.children[0].getClientRect()

        if (
            shapeRect.x < groupRect.x ||
            shapeRect.y < groupRect.y ||
            shapeRect.x + shapeRect.width > groupRect.x + groupRect.width ||
            shapeRect.y + shapeRect.height > groupRect.y + groupRect.height
        ) {
            group.width(shapeRect.x + shapeRect.width - groupRect.x)
            group.height(shapeRect.y + shapeRect.height - groupRect.y)
        }
    }

    useEffect(() => {
        const groupRect = groupRef.current.getClientRect()
        const clip = {
            x: groupRect.x,
            y: groupRect.y,
            width: groupRect.width,
            height: groupRect.height
        }
        groupRef.current.setClip(clip)
    }, [])

    return (
        <Fragment>
            <Layer
                listening={!draggable}
                clipFunc={(ctx) => {
                    ctx.rect(0, 0, 200, 200)
                }}
            >
                <Group
                    ref={groupRef}
                    width={background.width}
                    height={background.height}
                    onDragMove={handlerDragMove}
                    clipFunc={(ctx) => {
                        const groupRect = groupRef.current.getClientRect()
                        ctx.rect(groupRect.x, groupRect.y, groupRect.width, groupRect.height)
                    }}
                >
                    <BackgroundLayer
                        onClick={() => dispatch(actionChangeSelectedLayer(null))}
                        imageProps={background}
                        showImage={false}
                    />
                    {layers?.map((layer, i) => {
                        return layer.layerType === 'text' ? (
                            <TextLayer
                                key={i}
                                textProps={layer}
                                backgroundWidth={background.width}
                                isSelected={layer.id === selectedLayer?.id}
                                zIndexDefault={i + 1}
                                onSelect={() => dispatch(actionChangeSelectedLayer(layer))}
                                onChange={onUpdateLayerAttr}
                            />
                        ) : (
                            <ImageLayer
                                key={i}
                                imageProps={layer}
                                index={i}
                                isSelected={layer.id === selectedLayer?.id}
                                zIndexDefault={i + 1}
                                onSelect={(newAttrs) =>
                                    dispatch(actionChangeSelectedLayer(newAttrs))
                                }
                                onChange={onUpdateLayerAttr}
                                onChangeSizeImage={debounce(
                                    (newSize) =>
                                        dispatch(
                                            actionChangeSelectedLayer({ ...layer, ...newSize })
                                        ),
                                    100
                                )}
                            />
                        )
                    })}
                </Group>
            </Layer>
            <Layer listening={false}>
                <BackgroundLayer
                    onClick={() => dispatch(actionChangeSelectedLayer(null))}
                    imageProps={background}
                />
            </Layer>
        </Fragment>
    )
}

export default MockupLayers
