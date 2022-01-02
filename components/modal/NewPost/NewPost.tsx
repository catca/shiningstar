/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import s from '../CommonModal.module.scss';

import { ModalDataType } from 'types/modal/types';

import { useSelector, useDispatch } from 'react-redux';
import { selectModal, setModal } from 'lib/redux/modal/modalSlice';
import {
  initPostImage,
  setPostImage,
  selectNewPost,
  addPostImage,
  deletePostImage,
} from 'lib/redux/newPost/newPostSlice';
import { selectUser } from 'lib/redux/user/userSlice';
import Crop from './Crop';
import classNames from 'classnames';
import ProfileImage from 'components/profile/ProfileImage';
import Link from 'next/link';
import styled from '@emotion/styled';
import axios from 'axios';
import { NEXT_SERVER } from 'config';

interface ModalProps {
  modalData: ModalDataType[];
}

const NewPost: React.FC = () => {
  const nextId = useRef(1);
  const imageControlRef = useRef<HTMLDivElement>(null);
  const [imageNumber, setImageNumber] = useState<number>(1);
  const [postState, setPostState] = useState<string>('newPost');
  const [zoom, setZoom] = useState<number>(1);
  const [imageControl, setImageControl] = useState<boolean>(false);
  const [text, setText] = useState<number>(0);
  const images = useSelector(selectNewPost);
  const { userInfo } = useSelector(selectUser);
  const dispatch = useDispatch();
  const closeModal = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    e.preventDefault();
    dispatch(initPostImage());
    dispatch(setModal('newPost', false));
  };

  const hiddenFileInput: any = useRef<HTMLInputElement>(null);

  const handleClick = (event: any) => {
    event.preventDefault();
    let myInput: HTMLElement | null = document.getElementById('input');
    myInput?.click();
  };

  function readFile(file: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const handleChange = async (event: any) => {
    const fileUploaded = event.target.files[0];
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let imageDataUrl: any = await readFile(file);

      const postImage = {
        id: nextId.current,
        image: imageDataUrl,
      };

      setPostState(() => 'crop');
      if (nextId.current === 1) {
        dispatch(setPostImage(imageDataUrl));
        setImageNumber(() => 1);
      } else {
        dispatch(addPostImage(postImage));
        setImageNumber((imageNumber) => imageNumber + 1);
      }
      nextId.current += 1;
    }
  };

  const nextPostState = () => {
    if (postState === 'crop') {
      setPostState(() => 'content');
    }
  };
  const prevPostState = () => {
    if (postState === 'crop') {
      setPostState(() => 'newPost');
      dispatch(initPostImage());
      nextId.current = 1;
    } else if (postState === 'content') {
      setPostState(() => 'crop');
    }
  };

  const prevImg = () => {
    setImageNumber((imageNumber) => imageNumber - 1);
  };
  const nextImg = () => {
    setImageNumber((imageNumber) => imageNumber + 1);
  };

  useEffect(() => {
    dispatch(initPostImage());
  }, []);

  function clickClopEvent(event: {
    target: any;
    currentTarget: {
      querySelector: (arg0: string) => {
        (): any;
        new (): any;
        querySelectorAll: { (arg0: string): any; new (): any };
      };
    };
  }) {
    var target = event.target;

    if (imageControl === false) return;

    if (imageControlRef.current?.contains(target)) return;
    setImageControl(false);
  }

  useEffect(() => {
    console.log('num', imageNumber, nextId.current);
  }, [imageNumber]);

  const deleteImage = (e: any, deleteId: number) => {
    console.log('deleteId', deleteId);
    e.preventDefault();
    if (images.length === 1) {
      setPostState(() => 'newPost');
      dispatch(initPostImage());
      nextId.current = 1;
    } else {
      if (imageNumber === 1) {
        setImageNumber(() => 1);
      } else {
        setImageNumber((imageNumber) => imageNumber - 1);
      }
    }
    dispatch(deletePostImage({ id: deleteId }));
  };

  const postContent = () => {
    var formdata = new FormData();
    for (let j = 0; j < images.length; j++) {
      const imgDataUrl = images[j].croppedImage;
      var blobBin = atob(imgDataUrl.split(',')[1]); // base64 데이터 디코딩
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: 'image/png' }); // Blob 생성
      formdata.append('file', file);
    }
    /* key 확인하기 */
    for (let key of formdata.keys()) {
      console.log(key);
    }

    /* value 확인하기 */
    for (let value of formdata.values()) {
      console.log(value);
    }
    axios
      .post(`${NEXT_SERVER}/test/newPost`, formdata, {
        headers: {
          'Content-Type': `multipart/form-data`,
        },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total),
          );
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Content: React.FC = () => {
    return (
      <div className={s.contentWrapContent}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', margin: '16px' }}>
            <div style={{ marginRight: '12px' }}>
              <Link href={`/${userInfo.username}`}>
                <a>
                  <ProfileImage
                    size={'nav'}
                    border={true}
                    borderColor={'black'}
                    imageUrl={userInfo.profileImageUrl}
                  />
                </a>
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                color: '#262626',
              }}>
              <div>{userInfo.username}</div>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <textarea
              name=""
              id=""
              placeholder="문구 입력..."
              autoComplete="none"
              autoCorrect="none"
              spellCheck="false"
              style={{
                boxSizing: 'border-box',
                border: 'none',
                resize: 'none',
                padding: '0 16px',
                width: '100%',
                height: '168px',
                outline: 'none',
                overflow: 'auto',
                lineHeight: '16px',
                fontSize: '16px',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              width: '100%',
            }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
              }}>
              <svg
                aria-label="이모티콘"
                color="#8e8e8e"
                fill="#8e8e8e"
                height="20"
                role="img"
                viewBox="0 0 24 24"
                width="20">
                <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z" />
              </svg>
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <div style={{ padding: '0 16px', fontSize: '12px' }}>
              {text}/2500
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={s.outerContainerPost} onClick={closeModal} />
      <div
        className={classNames(s.innerContainerPost, {
          [s.innerContainerPostText]: postState === 'content',
        })}>
        <div>
          <div className={s.headerPost}>
            <div>
              <div>
                {postState !== 'newPost' && (
                  <button onClick={prevPostState}>
                    <svg
                      aria-label="돌아가기"
                      color="#262626"
                      fill="#262626"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                      style={{ transform: 'translateX(-8px)' }}>
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="2.909"
                        x2="22.001"
                        y1="12.004"
                        y2="12.004"></line>
                      <polyline
                        fill="none"
                        points="9.276 4.726 2.001 12.004 9.276 19.274"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"></polyline>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div>
              <h1>
                {postState === 'newPost'
                  ? '새 게시물 만들기'
                  : postState === 'crop'
                  ? '자르기'
                  : '새 게시물 만들기'}
              </h1>
            </div>
            <div>
              <div>
                {postState === 'crop' ? (
                  <button onClick={nextPostState}>다음</button>
                ) : postState === 'content' ? (
                  <button onClick={postContent}>공유하기</button>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className={classNames(s.contentWrapPost, {
              [s.contentWrapPostText]: postState === 'content',
            })}>
            <div>
              {postState === 'newPost' ? (
                <div className={s.contentPost}>
                  <svg
                    aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                    color="#262626"
                    fill="#262626"
                    height="77"
                    role="img"
                    viewBox="0 0 97.6 77.3"
                    width="96">
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"></path>
                    <path
                      d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"></path>
                    <path
                      d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"></path>
                  </svg>
                  <h2>사진과 동영상을 여기에 끌어다 놓으세요</h2>
                  <div className={s.inputButton}>
                    <button onClick={handleClick}>컴퓨터에서 선택</button>
                  </div>
                </div>
              ) : postState === 'crop' ? (
                images[0]?.image && (
                  <div onClick={clickClopEvent}>
                    <div className={s.imageWrap}>
                      {images.map((props, index) => {
                        if (index === imageNumber - 1) {
                          return (
                            <div key={props.id}>
                              <Crop image={props.image} id={props.id} />
                            </div>
                          );
                        }
                      })}
                    </div>
                    {imageNumber > 1 && (
                      <div className={s.prevButtonWrapper} onClick={prevImg}>
                        <div
                          style={{
                            backgroundImage: 'url(/instagramIcon.png)',
                            backgroundPosition: '-130px -98px',
                          }}></div>
                      </div>
                    )}
                    {imageNumber < images.length && (
                      <div className={s.nextButtonWrapper} onClick={nextImg}>
                        <div
                          style={{
                            backgroundImage: 'url(/instagramIcon.png)',
                            backgroundPosition: '-162px -98px',
                          }}></div>
                      </div>
                    )}
                    {imageControl && (
                      <div
                        ref={imageControlRef}
                        className={s.thumbnailContainer}
                        style={{
                          width: `${
                            images.length * 94 + (images.length - 1) * 12 + 100
                          }px`,
                        }}>
                        <div
                          style={{
                            height: '94px',
                            width: `${
                              images.length * 94 + (images.length - 1) * 12
                            }px`,
                          }}>
                          <div
                            style={{ position: 'absolute', transform: 'none' }}>
                            <div
                              style={{
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                border: 'none',
                                padding: 0,
                                height: '94px',
                              }}>
                              <div
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0)',
                                  boxShadow: 'rgba(0, 0, 0, 0) 0px 2px 6px 2px',
                                  transform: 'none',
                                }}>
                                <div
                                  style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0)',
                                    height: '100%',
                                    width: `${
                                      images.length * 94 +
                                      (images.length - 1) * 12
                                    }px`,
                                    display: 'flex',
                                  }}>
                                  {images.map((props, index) => {
                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          backgroundColor: 'rgba(0, 0, 0, 0)',
                                          position: 'relative',
                                          marginRight: '12px',
                                        }}>
                                        <img
                                          src={props.croppedImage}
                                          alt={props.image}
                                          style={{
                                            // backgroundImage: `url(${image})`, backgroundRepeat: 'no-repeat',
                                            height: '94px',
                                            transform:
                                              'translateX(0px) translateY(0px) scale(1)',
                                            transition: 'none 0s ease 0s',
                                            width: '94px',
                                          }}
                                          onClick={() =>
                                            setImageNumber(() => index + 1)
                                          }
                                        />
                                        <div
                                          role="button"
                                          className={s.thumbnailDeleteWrap}
                                          onClick={(e) =>
                                            deleteImage(e, props.id)
                                          }
                                          style={{
                                            display: `${
                                              index + 1 === imageNumber
                                                ? 'block'
                                                : 'none'
                                            }`,
                                          }}>
                                          <button
                                            type="button"
                                            style={{ cursor: 'pointer' }}>
                                            <div>
                                              <svg
                                                aria-label="삭제"
                                                color="#ffffff"
                                                fill="#ffffff"
                                                height="12"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="12">
                                                <line
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  x1="21"
                                                  x2="3"
                                                  y1="3"
                                                  y2="21"></line>
                                                <line
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  x1="21"
                                                  x2="3"
                                                  y1="21"
                                                  y2="3"></line>
                                              </svg>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            height: '94px',
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <div
                            onClick={handleClick}
                            aria-disabled="false"
                            role="button"
                            style={{
                              height: '48px',
                              width: '48px',
                              border: '1px solid #FFF',
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}>
                            <svg
                              aria-label="+ 아이콘"
                              color="#8e8e8e"
                              fill="#8e8e8e"
                              height="22"
                              role="img"
                              viewBox="0 0 24 24"
                              width="22">
                              <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"></path>
                            </svg>
                          </div>
                          <form
                            method="POST"
                            role="presentation"
                            style={{ display: 'none' }}>
                            <input
                              accept="image/jpeg,image/png,image/heic,image/heif"
                              type="file"
                              ref={hiddenFileInput}
                              onChange={handleChange}
                              style={{ display: 'none' }}
                            />
                          </form>
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        padding: '8px',
                      }}
                      role="button">
                      <div
                        className={s.zoomButtonWrap}
                        onClick={() => setImageControl(true)}>
                        <div>
                          <button className={s.zoomButton} type="button">
                            <div>
                              <svg
                                aria-label="미디어 갤러리 열기"
                                color="#ffffff"
                                fill="#ffffff"
                                height="16"
                                role="img"
                                viewBox="0 0 24 24"
                                width="16">
                                <path d="M19 15V5a4.004 4.004 0 00-4-4H5a4.004 4.004 0 00-4 4v10a4.004 4.004 0 004 4h10a4.004 4.004 0 004-4zM3 15V5a2.002 2.002 0 012-2h10a2.002 2.002 0 012 2v10a2.002 2.002 0 01-2 2H5a2.002 2.002 0 01-2-2zm18.862-8.773A.501.501 0 0021 6.57v8.431a6 6 0 01-6 6H6.58a.504.504 0 00-.35.863A3.944 3.944 0 009 23h6a8 8 0 008-8V9a3.95 3.95 0 00-1.138-2.773z" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className={s.contentWrap}>
                  <div style={{ position: 'relative' }}>
                    {images.map((props, index) => {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          className={s.croppedImg}
                          src={props.croppedImage}
                          alt="Cropped"
                          style={{
                            display: `${
                              index + 1 === imageNumber ? 'block' : 'none'
                            }`,
                          }}
                        />
                      );
                    })}
                    {imageNumber > 1 && (
                      <div className={s.prevButtonWrapper} onClick={prevImg}>
                        <div
                          style={{
                            backgroundImage: 'url(/instagramIcon.png)',
                            backgroundPosition: '-130px -98px',
                          }}></div>
                      </div>
                    )}
                    {imageNumber < images.length && (
                      <div className={s.nextButtonWrapper} onClick={nextImg}>
                        <div
                          style={{
                            backgroundImage: 'url(/instagramIcon.png)',
                            backgroundPosition: '-162px -98px',
                          }}></div>
                      </div>
                    )}
                  </div>
                  <Content />
                </div>
              )}
            </div>
            <form>
              <input
                accept="image/jpeg,image/png,image/heic,image/heif"
                type="file"
                id="input"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;

type ContainerProps = {
  key: number;
  index: number;
  current: number;
};

const Container = styled.div<ContainerProps>`
  display: ${({ index, current }) => (current === index ? 'block' : 'none')};
`;
