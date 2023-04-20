import { debounce } from 'lodash'
import React, { Fragment } from 'react'
import { Group, Layer } from 'react-konva'
import BackgroundLayer from './BackgroundLayer'
import ImageLayer from './ImageLayer'
import TextLayer from './TextLayer'
import { handleCalculateDpi } from '../../../helper'
import { changeSelectedLayer, updateLayerAttrs } from '../../../store/slices'

const MockupLayers = ({ draggable, background, selectedLayer, dispatch, layers }) => {

    const onUpdateLayerAttr = (newAttrs) => {
        dispatch(updateLayerAttrs(newAttrs))
    }

    return (
        <Fragment>
            <Layer listening={!draggable}>
                <Group>
                    <BackgroundLayer
                        onClick={() => dispatch(changeSelectedLayer(null))}
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
                                onSelect={() => dispatch(changeSelectedLayer(layer))}
                                onChange={onUpdateLayerAttr}
                            />
                        ) : (
                            <ImageLayer
                                key={i}
                                imageProps={layer}
                                index={i}
                                isSelected={layer.id === selectedLayer?.id}
                                zIndexDefault={i + 1}
                                onSelect={(newAttrs) => dispatch(changeSelectedLayer(newAttrs))}
                                onChange={onUpdateLayerAttr}
                                onChangeSizeImage={debounce((newSize) => {
                                    const newAttrs = { ...layer, ...newSize }
                                    const dpi = handleCalculateDpi(newAttrs)
                                    dispatch(changeSelectedLayer({ ...newAttrs, dpi }))
                                }, 100)}
                            />
                        )
                    })}
                </Group>
            </Layer>
            <Layer listening={false}>
                <BackgroundLayer imageProps={background} />
            </Layer>
        </Fragment>
    )
}

export default MockupLayers

