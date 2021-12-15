/* eslint-disable @next/next/no-img-element */
import { containerClasses } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNewPost,
  updateCroppedImage
} from 'lib/redux/newPost/newPostSlice';

const Crop = ({ image }: any, id: number) => {
  const [crop, setCrop] = useState({ x: 100, y: 100 })
  const [zoom, setZoom] = useState(1)
  const [resultCroppedAreaPixels, setResultCroppedAreaPixels] = useState({ width: 0, height: 0, x: 0, y: 0, });
  const dispatch = useDispatch();

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    console.log('hi', image, id);
    await showCroppedImage(croppedAreaPixels);
  }, [])

  const showCroppedImage = async (croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels
    );
    // id 수정 필요
    dispatch(updateCroppedImage({ id: 1, croppedImage: croppedImage }));
  }

  useEffect(() => {
    // postState content => crop 으로 돌아왔을 때 cropped 상태 유지 필요
    dispatch(updateCroppedImage({ id: 1, croppedImage: image }));
  }, [])

  return (
    <>
      <Cropper
        image={image}
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