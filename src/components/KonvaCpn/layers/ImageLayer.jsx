import React, { Fragment, memo, useCallback, useEffect, useRef } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'

// moveTo(index) // moveToBottom()
const ImageLayer = memo((props) => {
    const { imageProps, isSelected, onSelect, onChange, zIndexDefault, onChangeSizeImage } = props
    const { isLock } = imageProps

    const imageRef = useRef(null)
    const trRef = useRef(null)

    // eslint-disable-next-line no-unused-vars
    const [image, status] = useImage(imageProps.src, 'anonymous', 'origin')

    useEffect(() => {
        const imageNode = imageRef.current
        imageNode.on('mouseenter mouseup dragend', () => {
            imageNode.getStage().container().style.cursor = 'grab'
        })
        imageNode.on('mouseleave', () => {
            imageNode.getStage().container().style.cursor = 'default'
        })
        imageNode.on('mousedown', () => {
            imageNode.getStage().container().style.cursor = 'grabbing'
        })

        return () => {
            imageNode.off('mouseenter')
            imageNode.off('mouseup')
            imageNode.off('dragend')
            imageNode.off('mouseleave')
            imageNode.off('mousedown')
        }
    }, [])

    // useEffect(() => {
    //     const imageNode = imageRef.current
    //     if (imageNode) {
    //         console.log({imageProps})
    //         console.log({rect: imageNode.getClientRect()})
    //     }
    // },[])

    // const onShowToolbar = useCallback(() => {
    //     const trNode = trRef.current
    //     if (trNode) {
    //         const rotateIcon = trNode.findOne('.rotater')
    //         const pos = rotateIcon.getAbsolutePosition()
    //         const rotation = imageProps.rotation
    //         updateToolbarStyle({ ...pos, height: imageProps.height, rotation }, 'image-toolbar')
    //     }
    // }, [imageProps.height, imageProps.rotation])

    const onShowToolbar = useCallback(() => { }, [])

    useEffect(() => {
        const imageNode = imageRef.current
        const trNode = trRef.current
        if (imageNode && trNode) {
            if (isSelected && !isLock) {
                trNode.nodes([imageNode])
                trNode.getLayer().batchDraw()
                onShowToolbar()
                imageNode.moveToTop()
                trNode.moveToTop()
            } else {
                imageNode.moveTo(zIndexDefault)
                onHideToolbar()
            }
        }
    }, [isSelected, isLock, onShowToolbar, zIndexDefault])

    useEffect(() => {
        onShowToolbar()
    }, [imageProps, onShowToolbar])

    const onItemClick = () => {
        if (isLock) return
        onSelect({ ...imageProps })
    }

    const onDragMove = () => {
        onHideToolbar()
    }

    const onDragStart = () => {
        const imageNode = imageRef.current
        imageNode?.moveToTop()
        onItemClick()
    }

    const onDragEnd = (event) => {
        onChange({
            ...imageProps,
            x: event.target.x(),
            y: event.target.y(),
        })
    }

    const onHideToolbar = () => {
        const toolbar = document.getElementById('image-toolbar')
        toolbar.style.display = 'none'
    }

    const onTransformEnd = (event) => {
        onChange(imageRef.current && imageRef.current.attrs)
    }

    const onTransformRealTime = (event) => {
        const imageNode = event.target
        const size = {
            width: imageNode.width() || 1,
            height: imageNode.height() || 1,
            scaleX: imageNode.scaleX() || 1,
            scaleY: imageNode.scaleY() || 1,
            src: imageNode.attrs.src,
        }
        onHideToolbar()
        onChangeSizeImage(size)
    }

    return (
        <Fragment>
            <Image
                {...imageProps}
                image={image}
                ref={imageRef}
                draggable={!isLock}
                onClick={onItemClick}
                onTap={onItemClick}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                onDragMove={onDragMove}
                onDragStart={onDragStart}
                preventDefault={true}
                globalCompositeOperation="source-atop"
            />
            {isSelected && !isLock && (
                <Transformer
                    ref={trRef}
                    keepRatio={true}
                    centeredScaling={true}
                    anchorCornerRadius={30}
                    rotateAnchorOffset={20}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    onTransform={onTransformRealTime}
                    onTransformEnd={onShowToolbar}
                />
            )}
        </Fragment>
    )
})

export default ImageLayer

