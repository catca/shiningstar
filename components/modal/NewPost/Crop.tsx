/* eslint-disable @next/next/no-img-element */
import { containerClasses } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNewPost,
  updateCroppedImage,
  updateCroppedAreaPixel
} from 'lib/redux/newPost/newPostSlice';

interface CropProps {
  image: string,
  id: number
}

const Crop = ({ image, id }: CropProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const newPostData = useSelector(selectNewPost);
  const dispatch = useDispatch();

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    dispatch(updateCroppedAreaPixel({ ...croppedAreaPixels, id: id }));
    await showCroppedImage(croppedAreaPixels);
  }, [])

  const showCroppedImage = async (croppedAreaPixels: any) => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels
    );
    // id 수정 필요
    dispatch(updateCroppedImage({ id: id, croppedImage: croppedImage }));
  }

  useEffect(() => {
    // postState content => crop 으로 돌아왔을 때 cropped 상태 유지 필요
    dispatch(updateCroppedImage({ id: id, croppedImage: image }));
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
        initialCroppedAreaPixels={newPostData[id - 1].croppedAreaPixel}
      />
      {/* <button onClick={showCroppedImage} style={{ position: 'absolute', zIndex: 3000 }}>저장</button> */}
      {/* <img src={img} alt="Cropped" style={{ position: 'absolute', zIndex: 2001 }} /> */}
    </>
  )
}

export default Crop;