/* eslint-disable @next/next/no-img-element */
import { containerClasses } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage';

const Crop = (image: any, setPostImages: any, postImages: any, id: number) => {
  const [crop, setCrop] = useState({ x: 100, y: 100 })
  const [zoom, setZoom] = useState(1)
  const [resultCroppedAreaPixels, setResultCroppedAreaPixels] = useState({ width: 0, height: 0, x: 0, y: 0, });
  const [img, setImg] = useState("");

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
    setResultCroppedAreaPixels(croppedAreaPixels);
  }, [])

  const showCroppedImage = async () => {
    const croppedImage = await getCroppedImg(
      image.image,
      resultCroppedAreaPixels
    )
    console.log('image', croppedImage)
    setPostImages(postImages.map(
      (postImage: { id: number; image: string; cropImage: string }) => postImage.id === id
        ? { ...postImage, cropImage: croppedImage }
        : postImage
    ));
  }

  useEffect(() => {
    showCroppedImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultCroppedAreaPixels])

  useEffect(() => {
    console.log('post', postImages, id);
  }, [postImages, id])

  return (
    <>
      <Cropper
        image={image.image.image}
        crop={crop}
        zoom={zoom}
        aspect={4 / 4}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      {/* <button onClick={showCroppedImage} style={{ position: 'absolute', zIndex: 3000 }}>저장</button> */}
      {/* <img src={img} alt="Cropped" style={{ position: 'absolute', zIndex: 2001 }} /> */}
    </>
  )
}

export default Crop;