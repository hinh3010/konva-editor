import React, {useEffect, useRef, useState} from 'react'
import {Image} from 'react-konva'
const BackgroundLayer = React.memo(({imageProps, onClick, showImage = true}) => {
    const imageRef = useRef()
    const [image, setImage] = useState(null)

    useEffect(() => {
        const img = new window.Image()
        img.onload = () => {
            setImage(img)
        }
        img.crossOrigin = 'Anonymous'
        img.src = imageProps.src

        if (imageRef.current) imageRef.current.zIndex(0)

        return () => {
            img.onload = null
        }
    }, [imageProps.src])

    return (
        <Image
            ref={imageRef}
            {...imageProps}
            image={showImage ? image : null}
            fill={showImage ? '' : imageProps.fill}
            onClick={onClick}
        />
    )
})
export default BackgroundLayer

