import Konva from 'konva'

/**
 * convert pixels -> inches
 * @param {Number} pixels
 * @param {Number} dpi - dpi value for most screens || 150
 * @returns {Number}
 */
export function pixelsToInches(pixels, dpi = 150) {
    return parseFloat(pixels) / dpi
}

export function inchesToPixels(inches, dpi = 150) {
    return parseFloat(inches) * dpi
}

export function getCenterCoordinate(elementCoordinate, frameCoordinate) {
    return {
        x: Math.abs(frameCoordinate.x - elementCoordinate.x) / 2,
        y: Math.abs(frameCoordinate.y - elementCoordinate.y) / 2
    }
}

export function getImageAttrBySrc(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function () {
            const width = this.naturalWidth // Get natural width image
            const height = this.naturalHeight // Get the natural height image

            // Use pixels per inch (PPI) to calculate DPI
            const dpiWidth = (width / this.width) * 150 // Calculate resolution by width
            const dpiHeight = (height / this.height) * 150 // Calculate resolution by height

            resolve({ dpiWidth, dpiHeight, width, height })
        }
        img.onerror = reject
        img.src = imageSrc
    })
}

export function calculateDpi(src, { sizeWidth, sizeHeight }) {
    // get dpi from image src, sizeWidth, sizeHeight
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = src
        img.onload = function () {
            // const dpiWidth = sizeWidth / (this.width / 150)
            // const dpiHeight = sizeHeight / (this.height / 150)

            const dpiWidth = this.width / (sizeWidth / 150)
            const dpiHeight = this.height / (sizeHeight / 150)

            resolve({ dpiWidth, dpiHeight })
        }
        img.onerror = reject
    })
}

export function hideToolbar() {
    const textToolbar = document.getElementById('text-toolbar')
    const imageToolbar = document.getElementById('image-toolbar')
    if (textToolbar) textToolbar.style.display = 'none'
    if (imageToolbar) imageToolbar.style.display = 'none'
}

export function roundDecimal(number, decimalPlaces) {
    return decimalPlaces ? +number.toFixed(decimalPlaces) : +number.toFixed(0)
}

export function updateToolbarStyle(
    areaPosition = { x: 0, y: 0, width: 0, height: 0 },
    toolbarId = ''
) {
    const toolbar = document.getElementById(toolbarId)
    if (!toolbar) return
    if (toolbarId === 'image-toolbar') {
        const textToolbar = document.getElementById('text-toolbar')
        if (textToolbar) textToolbar.style.display = 'none'
    } else {
        const imageToolbar = document.getElementById('image-toolbar')
        if (imageToolbar) imageToolbar.style.display = 'none'
    }
    // const additionalX = toolbarId === 'image-toolbar' ? 25 : -80
    const additionalX = toolbarId === 'image-toolbar' ? 25 : -50
    const additionalY = toolbarId === 'image-toolbar' ? 20 : 40
    toolbar.style.display = 'flex'
    const toolbarWidth = toolbar.offsetWidth
    let top = areaPosition.y + (toolbarId === 'image-toolbar' ? 80 : 60)
    let left = areaPosition.x + additionalX + toolbarWidth / 2
    if (areaPosition.y < 180) {
        top = areaPosition.y + areaPosition.height + 160 + additionalY
    }
    toolbar.style.top = top + 'px'
    toolbar.style.left = left + 'px'
}

export function debounce(result, delay) {
    let timeoutId

    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            return result
        }, delay)
    }
}

export function increaseNumber(number, increment = 0.05) {
    const remainder = number % increment
    return remainder === 0 ? number + increment : number + increment - remainder
}
export function decreaseNumber(number, decrement = 0.05) {
    const remainder = number % decrement
    return remainder === 0 ? number - decrement : number - decrement - remainder
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

export const fontSpecToComponents = (value) => {
    let tmp = value.split(':'),
        family = tmp[0],
        variant = tmp[1] || '400',
        type = tmp[2],
        style = '',
        weight

    if (/(\d+)i$/.test(variant)) {
        style = 'italic'
        weight = +RegExp.$1
    } else {
        weight = +variant
    }

    return {
        family,
        weight,
        style,
        type
    }
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
            area: { side: key, src: image_path, widthRatio, heightRatio, ratioDefault: scaleRatio },
            stageRef: null
        }
    })
}

export const onCapture = (currentSide, { isGetArtwork, isGetArea }) => {
    const { ratioDefault, side, stageRef, background } = currentSide

    const stage = stageRef.getStage()

    let artwork = null
    let area = null

    if (stage && stage.toDataURL) {
        stage.scale({ x: 1, y: 1 })
        stage.position({ x: 0, y: 0 })
        stage.clip({
            x: background.x,
            y: background.y,
            width: background.width,
            height: background.height
        })

        stage.batchDraw()

        stage.find('Transformer').forEach((transformer) => {
            transformer.visible(false)
        })

        if (isGetArea) {
            const stageURL = stage.toDataURL()

            const stageBlob = URL.createObjectURL(convertBase64ToBlob(stageURL))
            area = stageBlob ? { side, src: stageBlob, ratioDefault, background } : null

            // const canvas = stage.toCanvas({pixelRatio: 1 / ratioDefault})
            // canvas.toBlob((blob) => {
            //     const url = URL.createObjectURL(blob)
            //     console.log(url)
            //     area = url ? {side, src: url, ratioDefault, background} : null
            // })
        }

        if (isGetArtwork) {
            const group = stage.children[0]?.children[0]

            group.clip({
                x: background.x,
                y: background.y,
                width: background.width,
                height: background.height
            })

            // group.draw()

            const groupUrl =
                group && group.toDataURL
                    ? group.toDataURL({
                          mimeType: 'image/png',
                          pixelRatio: 1 / ratioDefault,
                          x: group.x(),
                          y: group.y(),
                          width: group.width(),
                          height: group.height()
                      })
                    : null

            artwork = groupUrl
                ? {
                      side,
                      src: URL.createObjectURL(convertBase64ToBlob(groupUrl))
                  }
                : null

            if (side === 'waistband') {
                const groupCanvas = group.toCanvas()
                const canvas = groupCanvas.cloneNode()
                const context = canvas.getContext('2d')
                context.drawImage(groupCanvas, 0, 0)

                // Remove transparent pixels
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const pixels = imageData.data
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i + 3] === 0) {
                        pixels[i] = 255
                        pixels[i + 1] = 255
                        pixels[i + 2] = 255
                        pixels[i + 3] = 0
                    }
                }
                context.putImageData(imageData, 0, 0)

                const link = document.createElement('a')
                link.href = canvas.toDataURL('image/png')
                link.download = side + '.png'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        }

        // const link = document.createElement('a')
        // link.href = stageBlob
        // link.download = 'stageBlob.png'
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)

        // const link2 = document.createElement('a')
        // link2.href = groupBlob
        // link2.download = 'groupBlob.png'
        // document.body.appendChild(link2)
        // link2.click()
        // document.body.removeChild(link2)
    }
    return {
        artwork,
        area
    }
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
