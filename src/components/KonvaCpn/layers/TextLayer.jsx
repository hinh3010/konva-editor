import React, { Fragment, memo, useCallback, useEffect, useRef } from 'react'
import { Text, Transformer } from 'react-konva'
import { initTextActualSize } from '../../../helper'

/**
 *
 * @param {*} param
 * @returns
 */
const TextLayer = memo((props) => {
    const { textProps, isSelected, onSelect, onChange, zIndexDefault, backgroundWidth } = props
    const { isLock } = textProps
    const textRef = useRef()
    const trRef = useRef()

    useEffect(() => {
        const layer = textRef.current
        layer.on('mouseenter mouseup dragend', () => {
            layer.getStage().container().style.cursor = 'grab'
        })
        layer.on('mouseleave', () => {
            layer.getStage().container().style.cursor = 'default'
        })
        layer.on('mousedown', () => {
            layer.getStage().container().style.cursor = 'grabbing'
        })

        return () => {
            layer.off('mouseenter')
            layer.off('mouseup')
            layer.off('dragend')
            layer.off('mouseleave')
            layer.off('mousedown')
        }
    }, [])

    // const onShowToolbar = useCallback(() => {
    //     if (trRef.current) {
    //         const rotateIcon = trRef.current.findOne('.rotater')
    //         const pos = rotateIcon.getAbsolutePosition()
    //         const rotation = textProps.rotation
    //         updateToolbarStyle({ ...pos, height: textProps.height, rotation }, 'text-toolbar')
    //     }
    // }, [textProps.height, textProps.rotation])

    const onShowToolbar = useCallback(() => { }, [])


    useEffect(() => {
        const textNode = textRef.current
        const trNode = trRef.current
        if (textNode && trNode) {
            if (isSelected && !isLock) {
                trNode.nodes([textNode])
                trNode.getLayer().batchDraw()
                // textNode.moveToTop()
                trNode.moveToTop()
                onShowToolbar()
            } else {
                // textNode.zIndex(zIndexDefault)
                onHideToolbar()
            }
        }
    }, [isSelected, isLock, onShowToolbar])

    useEffect(() => {
        onShowToolbar()
    }, [textProps, onShowToolbar])

    const onItemClick = (event) => {
        const textNode = event.target
        if (textNode.attrs.isLock) return
        onSelect()
    }

    const onDragStart = (event) => {
        // const textNode = event.target
        // textNode.moveToTop()
        onItemClick(event)
    }

    const onDragMove = () => {
        onHideToolbar()
    }

    const onDoubleClick = (event) => {
        const textNode = event.target
        if (textNode.attrs.isLock) return
        //hide textNode and transformer
        textNode.hide()
        trRef.current.hide()
        const textPosition = textNode.absolutePosition()
        // find position of text node relative to the stage
        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        }
        const textarea = document.createElement('textarea')

        // add class to absolute textarea
        textarea.id = 'InlineEditor'
        textarea.className = 'InlineEditor'
        document.getElementById('MockupEditor').appendChild(textarea)
        // document.body.appendChild(textarea)

        textarea.value = textNode.text()
        textarea.maxLength = 50
        textarea.style.top = areaPosition.y - textProps.offsetY + 'px'
        textarea.style.left = areaPosition.x - textProps.offsetX + 'px'
        textarea.style.whiteSpace = 'nowrap'
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px'
        textarea.style.maxWidth = backgroundWidth + 'px'
        textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px'
        textarea.style.fontSize = textNode.fontSize() + 'px'
        textarea.style.transformOrigin = 'left top'
        textarea.style.lineHeight = textNode.lineHeight()
        textarea.style.fontFamily = textNode.fontFamily()
        textarea.style.textAlign = textNode.align()
        textarea.style.color = textNode.fill()
        const rotation = textNode.rotation()
        let transform = ''
        if (rotation) {
            transform += 'rotateZ(' + rotation + 'deg)'
        }

        let px = 0
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
        if (isFirefox) {
            px += 2 + Math.round(textNode.fontSize() / 20)
        }
        transform += 'translateY(-' + px + 'px)'

        textarea.style.transform = transform

        // reset height
        textarea.style.height = 'auto'
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px'
        let newWidth
        let newHeight
        textarea.focus()
        function removeTextarea() {
            if (!textarea || !textarea.parentNode) {
                return
            }
            window.removeEventListener('click', handleOutsideClick)
            textNode.show()
            if (trRef.current) {
                trRef.current.show()
                trRef.current.forceUpdate()
            }
            const { height } = initTextActualSize(textNode.attrs)
            newHeight = height
            if (newWidth && newHeight) {
                const newAttrs = {
                    ...textProps,
                    text: textarea.value,
                    width: newWidth,
                    height: newHeight,
                }
                onChange(newAttrs)
            }
            textarea.parentNode.removeChild(textarea)
        }

        function setTextareaWidth(newWidth) {
            if (!newWidth) {
                // set width for placeholder
                newWidth = textNode.placeholder.length * textNode.fontSize()
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
            var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth)
            }

            var isEdge = document.documentMode || /Edge/.test(navigator.userAgent)
            if (isEdge) {
                newWidth += 1
            }
            textarea.style.width = newWidth + 'px'
        }

        textarea.addEventListener('keydown', function (e) {
            e.stopPropagation()
            if (!textarea.value) return
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
                textNode.text(textarea.value)
                removeTextarea()
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeTextarea()
            }
        })

        textarea.addEventListener('keyup', function (e) {
            e.stopPropagation()
        })

        function updateTextarea() {
            onHideToolbar()
            const divElement = document.createElement('pre')
            divElement.classList.add('text-area')
            divElement.innerHTML = textarea.value
            divElement.style.fontSize = textNode.fontSize() + 'px'
            divElement.style.lineHeight = textNode.fontSize() + 'px'
            divElement.style.fontFamily = textNode.fontFamily()
            divElement.style.textAlign = textNode.align()
            document.getElementById('main-preview').appendChild(divElement)
            newWidth = divElement.clientWidth + textNode.fontSize() / 2
            setTextareaWidth(newWidth)
            divElement.remove()
            textarea.style.height = 'auto'
            newHeight = textarea.scrollHeight + textNode.fontSize()
            textarea.style.height = newHeight + 'px'
        }

        textarea.addEventListener('keydown', function (e) {
            e.stopPropagation()
            updateTextarea()
        })

        textarea.addEventListener('paste', function (e) {
            setTimeout(() => {
                updateTextarea()
            })
        })

        function handleOutsideClick(e) {
            if (!textarea.value) return
            if (e.target !== textarea) {
                textNode.text(textarea.value)
                removeTextarea()
            }
        }
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick)
            window.addEventListener('touchend', handleOutsideClick)
        })
    }

    const onDragEnd = (event) => {
        onChange({
            ...textProps,
            x: event.target.x(),
            y: event.target.y(),
        })
    }

    const onTransformEnd = (event) => {
        const node = event.target
        const width = node.width() * node.scaleX()
        const height = node.height() * node.scaleY()
        const newAttrs = {
            ...node.attrs,
            fontSize: node.fontSize() * node.scaleX(),
            width,
            height,
            scaleX: 1,
            scaleY: 1,
            offsetX: width / 2,
            offsetY: height / 2,
        }
        node.setAttrs(newAttrs)
        onChange(newAttrs)
    }

    const boundBoxFunc = (oldBox, newBox) => {
        newBox.width = Math.max(50, newBox.width)
        return newBox
    }

    const onHideToolbar = () => {
        const toolbar = document.getElementById('text-toolbar')
        toolbar.style.display = 'none'
    }

    return (
        <Fragment>
            <Text
                onClick={onItemClick}
                onTap={onItemClick}
                ref={textRef}
                listen={false}
                {...textProps}
                draggable={!isLock}
                onDblClick={onDoubleClick}
                onDblTap={onDoubleClick}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                globalCompositeOperation="source-atop"
            />
            {isSelected && !isLock && (
                <Transformer
                    centeredScaling={true}
                    anchorCornerRadius={30}
                    rotateAnchorOffset={20}
                    keepRatio={true}
                    ref={trRef}
                    enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    boundBoxFunc={boundBoxFunc}
                    onTransform={onHideToolbar}
                    onTransformEnd={onShowToolbar}
                />
            )}
        </Fragment>
    )
})

export default TextLayer

