/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Swipe from 'react-easy-swipe';

type ImageSliderProps = {
	boardImageUrl: string[];
	type: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ boardImageUrl, type }) => {
	const [imgCount, setImgCount] = useState<number>(1);
	const [positionx, setPositionx] = useState<number>(0);
	const [endSwipe, setEndSwipe] = useState<boolean>(false);

	const prevImg = () => {
		setImgCount((imgCount) => imgCount - 1);
	};
	const nextImg = () => {
		setImgCount((imgCount) => imgCount + 1);
	};

	const onSwipeMove = (position: { x: number; y: number }) => {
		setEndSwipe(false);
		if (boardImageUrl.length == 1) {
			return;
		}
		if (imgCount == 1 && position.x < 0) {
			setPositionx(() => position.x);
			return;
		}
		if (imgCount > 1 && imgCount < boardImageUrl.length) {
			setPositionx(() => position.x);
			return;
		}
		if (imgCount == boardImageUrl.length && position.x > 0) {
			setPositionx(() => position.x);
			return;
		}
	};
	const onSwipeEnd = () => {
		if (positionx < -20) {
			setImgCount((imgCount) => imgCount + 1);
		}
		if (positionx > 20) {
			setImgCount((imgCount) => imgCount - 1);
		}
		setPositionx(() => 0);
		setEndSwipe(true);
	};

	return (
		<>
			<PostImage>
				<Swipe onSwipeEnd={onSwipeEnd} onSwipeMove={onSwipeMove}>
					<ImgDiv imgCount={imgCount} positionx={positionx} endSwipe={endSwipe}>
						{boardImageUrl.map((imageUrl, index) => {
							return <Img key={index} src={imageUrl} alt="" />;
						})}
					</ImgDiv>
				</Swipe>
				{imgCount > 1 && (
					<PrevButtonWrapper onClick={prevImg}>
						<div
							style={{
								backgroundImage: 'url(/instagramIcon.png)',
								backgroundPosition: '-130px -98px',
							}}></div>
					</PrevButtonWrapper>
				)}
				{imgCount < boardImageUrl.length && (
					<NextButtonWrapper onClick={nextImg}>
						<div
							style={{
								backgroundImage: 'url(/instagramIcon.png)',
								backgroundPosition: '-162px -98px',
							}}></div>
					</NextButtonWrapper>
				)}
			</PostImage>
			{boardImageUrl.length > 1 && (
				<ImageCounterWrapper type={type}>
					{boardImageUrl.map((props, index) => {
						return (
							<ImageCounter
								key={index}
								index={index}
								imgCount={imgCount}
							/>
						);
					})}
				</ImageCounterWrapper>
			)}
		</>
	)
};

export default ImageSlider;

type ImgCount = {
	imgCount: number;
	positionx?: number;
	index?: number;
	endSwipe?: boolean;
};

type ImgCounter = {
	type: string;
}

const buttonStyle = css`
  border: 0;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageCounterWrapper = styled.div<ImgCounter>`
  display: flex;
  justify-content: center;
  align-items: center;
	${({ type }) => type === 'main' ? `margin-bottom: 15px; margin-top: 15px;` : `transform: translateY(-20px);`}
`;

const ImageCounter = styled.div<ImgCount>`
  width: 6px;
  height: 6px;
  background: ${({ index, imgCount }) =>
		index === imgCount - 1 ? '#0095f6' : '#a8a8a8'};
  border-radius: 50%;
  &:not(:last-of-type) {
    margin-right: 4px;
  }
`;

const PostImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const ImgDiv = styled.div<ImgCount>`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform ${({ endSwipe }) => (endSwipe ? "0.2s" : "0s")};
  transform: translateX(
    ${({ imgCount, positionx }) => `calc(${positionx}px + ${-100 * (imgCount - 1)}%)`}
  );
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NextButtonWrapper = styled.button`
  ${buttonStyle}
  background: none;
  padding: 16px 8px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  & > div {
    height: 30px;
    width: 30px;
  }
`;

const PrevButtonWrapper = styled.button`
  ${buttonStyle}
  background: none;
  padding: 16px 8px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  & > div {
    height: 30px;
    width: 30px;
  }
`;