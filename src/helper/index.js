import Konva from 'konva'
import { RATIO_DPI } from '../const'

export function pixelsToInches(pixels, dpi = RATIO_DPI) {
    return parseFloat(pixels) / dpi
}

export function inchesToPixels(inches, dpi = RATIO_DPI) {
    return parseFloat(inches) * dpi
}

export function roundDecimal(number, decimalPlaces) {
    return decimalPlaces ? +number.toFixed(decimalPlaces) : +number.toFixed(0)
}

export function handleCalculateDpi(layer) {
    const { naturalWidth, naturalHeight, width, height, scaleX, scaleY, ratioDefault } = layer

    const realWidth = Math.abs(width * scaleX) / ratioDefault
    const realHeight = Math.abs(height * scaleY) / ratioDefault

    console.log({ realWidth, realHeight, naturalWidth, naturalHeight })

    const dpiWidth = naturalWidth / (realWidth / RATIO_DPI)
    const dpiHeight = naturalHeight / (realHeight / RATIO_DPI)

    return Math.min(dpiWidth, dpiHeight)
}

export function getImageAttrBySrc(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function () {
            const width = this.width
            const height = this.height

            resolve({ width, height })
        }
        img.onerror = reject
        img.src = imageSrc
    })
}

export const convertBase64ToBlob = (base64) => {
    const byteCharacters = atob(base64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: 'image/png' })
}

export const getDataCreateStages = (sideInfos, stageComponent, campaignId, productId) => {
    return Object.entries(sideInfos).map(([key, value]) => {
        const {
            template_url: image_path,
            size: { width: image_width, height: image_height }
        } = value

        const widthRatio = (stageComponent.width - 200) / image_width
        const heightRatio = (stageComponent.height - 200) / image_height

        const scaleRatio = Math.min(widthRatio, heightRatio)

        const width = image_width * scaleRatio
        const height = image_height * scaleRatio

        const background = {
            src: image_path,
            x: stageComponent.width / 2 - width / 2,
            y: stageComponent.height / 2 - height / 2,
            width: width,
            height: height,
            isBackground: true,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            fill: '#ffffff'
        }
        return {
            background,
            side: key,
            ratioDefault: scaleRatio,
            campaignId,
            productId,
            layers: [],
            ratio: scaleRatio,
            history: [],
            historyStep: 0,
            area: { side: key, src: null, widthRatio, heightRatio, ratioDefault: scaleRatio },
            stageRef: null
        }
    })
}

export const onCapture = (currentSide, { isGetArtwork, isGetArea }) => {
    const { ratioDefault, side, stageRef, background, area: currArea } = currentSide

    const stage = stageRef.getStage()

    let artwork = null
    let area = null

    if (stage && stage.toDataURL) {
        stage.scale({ x: 1, y: 1 })
        stage.position({ x: 0, y: 0 })
        // stage.clearRect(0, 0, stage.width, stage.height)

        stage.batchDraw()

        stage.find('Transformer').forEach((transformer) => {
            transformer.visible(false)
        })

        if (isGetArea) {
            // clear old area
            clearBlobInRAM(currArea.src)

            stage.toDataURL({
                x: background.x,
                y: background.y,
                width: background.width,
                height: background.height,
                callback: function (canvas) {
                    const stageBlob = URL.createObjectURL(convertBase64ToBlob(canvas))
                    area = stageBlob ? { side, src: stageBlob, ratioDefault, background } : null
                }
            })
        }

        if (isGetArtwork) {
            const group = stage.children[0]?.children[0]

            if (
                !group ||
                !group.children ||
                (group.children.length <= 1 &&
                    (group.children[0]?.attrs?.fill === '#ffffff' ||
                        group.children[0]?.attrs?.fill === '#fff'))
            ) {
                artwork = null
            } else {
                group.toDataURL({
                    pixelRatio: 1 / ratioDefault,
                    x: background.x,
                    y: background.y,
                    width: background.width,
                    height: background.height,
                    callback: function (canvas) {
                        const groupBlob = URL.createObjectURL(convertBase64ToBlob(canvas))
                        artwork = groupBlob
                            ? { side, src: groupBlob, ratioDefault, background }
                            : null
                        // const link = document.createElement('a')
                        // link.href = groupBlob
                        // link.download = side + '.png'
                        // document.body.appendChild(link)
                        // link.click()
                        // document.body.removeChild(link)
                    }
                })
            }
        }
    }
    return {
        artwork,
        area
    }
}

export const clearBlobInRAM = (blob, stageSides) => {
    let isExistSrc = false

    if (stageSides && stageSides.length) {
        isExistSrc = stageSides?.some((stageSide) => {
            const layers = stageSide.layers
            return layers.some((layer) => layer.src === blob)
        })
    }

    setTimeout(() => {
        if (!isExistSrc) {
            URL.revokeObjectURL(blob)
        }
    }, 0)
}

export const initTextActualSize = (textAttrs) => {
    const tr = initVirtualTransformer({
        text: textAttrs.text,
        fontSize: Math.round(textAttrs.fontSize),
        align: textAttrs.align,
        fontFamily: textAttrs.fontFamily,
        draggable: false,
        x: textAttrs.x,
        y: textAttrs.y,
        rotation: textAttrs.rotation
    })
    const { width, height } = tr.getSize()
    tr.destroy()
    return {
        width,
        height
    }
}

export const initVirtualTransformer = (textOptions) => {
    const cloneText = new Konva.Text(textOptions)
    // Re get width and height from transformer
    const tr = new Konva.Transformer({
        nodes: [cloneText]
    })
    return tr
}
