/* eslint-disable jsx-a11y/alt-text */
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

import s from '../CommonModal.module.scss';

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

  useEffect(() => {
    console.log(newPostData[id - 1].croppedAreaPixel);
  }, [newPostData[id - 1].croppedAreaPixel])

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
        initialCroppedAreaPixels={newPostData[id - 1].exist ? newPostData[id - 1].croppedAreaPixel : null}
        style={{ containerStyle: containerStyle, mediaStyle: mediaStyle, cropAreaStyle: cropAreaStyle }}
      />
      {/* <div>
        <img src={image} style={{ width: '100%', height: '100%' }} />
        <div className={s.reactEasyCrop_CropAreaGrid}>

        </div>
      </div> */}
    </>
  )
}

const containerStyle = {
  height: 'calc(100% - 57px)',
  transform: 'translateY(57px)',
}

const mediaStyle: any = {
  color: 'rgba(0, 0, 0, 0)',
  height: '100%',
  width: '100%',
  objectFit: 'contain',
}

const cropAreaStyle = {
  color: 'rgba(0, 0, 0, 0)',
  height: '100%',
  width: '100%',
}

export default Crop;