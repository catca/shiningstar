/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ProfileImage } from 'components/profile';
import Link from 'next/link';
import { postFormatNumber, timeConvert } from 'lib/common';

import { Board } from 'types/profile/types';
import { FavoriteIcon, CommentIcon, DirectIcon, MarkIcon, EmoticonIcon, SeeMoreIcon } from 'components/ui/Icon';
import { fetchDeleteGood, fetchPostComment, fetchPostGood } from 'lib/apis/board';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'lib/redux/user/userSlice';
import { NEXT_SERVER } from 'config';
import fetcher from 'lib/common/fetcher';
import { setBoardModal, setModal, setSelectBoard } from 'lib/redux/modal/modalSlice';
import { ImageSlider } from 'components/ui/ImageSlider';

const Post = ({ mainData, postData, setMainData }: { mainData: Board[], postData: Board, setMainData: (value: any) => void }) => {
  const { userInfo } = useSelector(selectUser);
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>("");
  const [textAreaHeight, setTextAreaHeight] = useState<string>("auto");

  useEffect(() => {
    setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
  }, [text]);

  const onChangeHandler = (event: { target: { value: string } }) => {
    setTextAreaHeight("auto");
    setText(event.target.value);
  };

  const postSeeMore = () => {
    setSeeMore(() => true);
  };

  const [pressFavorite, setPressFavorite] = React.useState<boolean>(false);
  const goodHandler = async () => {
    if (pressFavorite) {
      const res = await fetchDeleteGood(
        postData._id,
        userInfo.accessToken,
      );
      if (!res.ok) {
        alert('좋아요를 취소하지 못했습니다.');
      } else {
        setPressFavorite(false);
        setMainData(mainData.map(data => {
          return data._id === postData._id ? { ...data, favoriteCnt: postData.favoriteCnt - 1 } : data
        }));
      }
    } else {
      const res = await fetchPostGood(
        postData._id,
        userInfo.accessToken,
      );
      if (!res.ok) {
        alert('좋아요를 누르지 못했습니다.');
      } else {
        setPressFavorite(true);
        setMainData(mainData.map(data => {
          return data._id === postData._id ? { ...data, favoriteCnt: postData.favoriteCnt + 1 } : data
        }));
      }
    }
  };

  const fetchFavoriteCheckHandler = async () => {
    const data: { check: boolean } = await fetcher(
      `${NEXT_SERVER}/v1/board/checkFavorite/${postData._id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo.accessToken}` },
      },
    );
    setPressFavorite(data.check);
  };

  const postReplyHandler = async (text: string) => {
    //TODO: rest api post 과정 추가
    const reply = {
      username: userInfo.username,
      content: text
    }
    if (postData !== undefined) {
      const res = await fetchPostComment(
        postData._id,
        userInfo.accessToken,
        reply,
      );
      if (!res.ok) {
        alert('댓글 작성에 실패했습니다');
      } else {
        setText(() => "");
        setMainData(mainData.map(data => {
          return data._id === postData._id ? { ...data, comment: [...data.comment, { ...reply, type: 'front' }] } : data
        }));
        setMainData(mainData.map(data => {
          return data._id === postData._id ? { ...data, commentCnt: postData.commentCnt + 1 } : data
        }));
      }
    }
  };

  useEffect(() => {
    fetchFavoriteCheckHandler();
  }, [])

  const openBoardModal = () => {
    dispatch(setSelectBoard(postData));
    dispatch(setBoardModal(true));
  }

  const openFavoriteModal = async () => {
    await dispatch(setSelectBoard(postData));
    dispatch(setModal('favorite', true));
  }

  return (
    <Article>
      <div>
        <HeaderWrapper>
          <div>
            <Header>
              <div>
                <ProfileImage
                  border={false}
                  size={'board'}
                  imageUrl={postData.profileImageUrl}
                />
              </div>
              <div>
                <span>
                  <Link href={`/${postData.username}`}>{postData.username}</Link>
                </span>
              </div>
            </Header>
            <ModalButtonWrapper>
              <button>
                <div>
                  <div>
                    <SeeMoreIcon />
                  </div>
                </div>
              </button>
            </ModalButtonWrapper>
          </div>
        </HeaderWrapper>
        <ImageWrapper>
          <div>
            <ImageSlider boardImageUrl={postData.boardImageUrl} type='main' />
          </div>
        </ImageWrapper>
        <div>
          <div>
            <div>
              <IconSection imgLength={postData.boardImageUrl.length}>
                <span>
                  <button onClick={() => goodHandler()}>
                    <FavoriteIcon
                      on={pressFavorite}
                    />
                  </button>
                </span>
                <span>
                  <button onClick={openBoardModal}>
                    <CommentIcon />
                  </button>
                </span>
                <span>
                  <button>
                    <DirectIcon />
                  </button>
                </span>
                <span>
                  <button>
                    <MarkIcon />
                  </button>
                </span>
              </IconSection>
              <FavoriteSection>
                <div onClick={openFavoriteModal}>
                  좋아요&nbsp;
                  <span>{postFormatNumber(postData.favoriteCnt)}</span>개
                </div>
              </FavoriteSection>
              <WriteWrapper>
                <div>
                  <PostDescriptionWrapper>
                    <div>
                      <NameSpan>
                        <Link href={`/${postData.username}`}>
                          {postData.username}
                        </Link>
                      </NameSpan>
                      &nbsp;
                      <PostDescription>
                        <span>
                          {postData.content.split('\n').length > 1 ? (
                            seeMore ? (
                              postData.content.split('\n').map((line) => {
                                return (
                                  <span key={line}>
                                    {line}
                                    <br />
                                  </span>
                                );
                              })
                            ) : (
                              <>
                                {postData.content.split('\n')[0]}
                                <SeeMore>
                                  ...&nbsp;
                                  <button onClick={postSeeMore}>더 보기</button>
                                </SeeMore>
                              </>
                            )
                          ) : (
                            postData.content
                          )}
                        </span>
                      </PostDescription>
                    </div>
                  </PostDescriptionWrapper>
                  <ReplyWrapper>
                    {postData.commentCnt > 2 && (
                      <ReplyCounter>
                        <div onClick={openBoardModal}>
                          댓글 {postData.commentCnt}개 모두 보기
                        </div>
                      </ReplyCounter>
                    )}
                    {postData.comment ? postData.comment.map((reply: any, index: number) => {
                      if (index > 1) {
                        return;
                      } else {
                        return (
                          <div key={index}>
                            <div>
                              <NameSpan>
                                <Link href={`/${reply.username}`}>{reply.username}</Link>
                              </NameSpan>
                              &nbsp;
                              <span>
                                <span>{reply.content}</span>
                              </span>
                            </div>
                          </div>
                        );
                      }
                    }) : null}
                  </ReplyWrapper>
                </div>
              </WriteWrapper>
              <TimeWrapper>
                <time onClick={openBoardModal}>
                  {timeConvert(postData.createdDate)}
                </time>
              </TimeWrapper>
              <CommentSection>
                <div>
                  <form>
                    <IconButton>
                      <EmoticonIcon />
                    </IconButton>
                    <textarea
                      ref={textAreaRef}
                      rows={1}
                      style={{
                        height: textAreaHeight,
                      }}
                      value={text}
                      onChange={onChangeHandler}
                      placeholder="댓글 달기..."
                      autoComplete="off"
                      autoCorrect="off"
                    />
                    <PostButton onClick={() => postReplyHandler(text)}>게시</PostButton>
                  </form>
                </div>
              </CommentSection>
            </div>
          </div>
        </div>
      </div>
    </Article>
  );
};

export default React.memo(Post);

const buttonStyle = css`
  border: 0;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  border: 1px solid #dbdbdb;
  margin-bottom: 24px;
  background-color: rgba(var(--d87, 255, 255, 255), 1);
  margin-left: -1px;
  margin-right: -1px;
  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const HeaderWrapper = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid #efefef;
  & > div {
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    align-items: center;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-shrink: 1;
  height: 60px;
  padding: 0 16px;
  & > div:last-of-type {
    margin-left: 14px;
  }
`;

const ModalButtonWrapper = styled.div`
  display: flex;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-right: 4px;
  & > button {
    width: 40px;
    height: 40px;
    border: 0;
    background-color: #fafafa;
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div`
  & > div {
    display: flex;
    flex-direction: column;
  }
`;

type ImgLength = {
  imgLength: number;
};

const IconSection = styled.section<ImgLength>`
  display: flex;
  margin-top: ${(props: { imgLength: number }) =>
    props.imgLength > 1 ? '-34px' : '4px'};
  padding: 0 16px;
  & button {
    width: 40px;
    height: 40px;
    ${buttonStyle}
  }
  & > span:first-of-type {
    margin-left: -8px;
  }
  & > span:last-of-type {
    margin-left: auto;
    margin-right: -10px;
  }
`;

const FavoriteSection = styled.section`
  display: flex;
  padding: 0 16px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  & > div {
    cursor: pointer;
  }
`;

const WriteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-bottom: 8px;
  font-size: 14px;
  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const PostDescriptionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
  & > div {
    width: 100%;
    text-align: left;
  }
`;

const PostDescription = styled.span`
  width: 100%;
  heigth: 100%;
  & > span {
  }
`;

const SeeMore = styled.span`
  & > button {
    border: 0;
    outline: 0;
    background-color: #fff;
    cursor: pointer;
    color: #8e8e8e;
    font-size: 14px;
  }
`;

const ReplyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    text-align: left;
  }
`;

const ReplyCounter = styled.div`
  margin-bottom: 4px;
  & > div {
    display: inline;
    color: #8e8e8e;
    cursor: pointer;
  }
`;

const NameSpan = styled.span`
  display: inline;
  & > a {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 5px;
    margin-left: -5px;
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  padding: 0 16px;
  margin-bottom: 4px;
  font-size: 10px;
  & > time {
    line-height: 18px;
    color: #8e8e8e;
    cursor: pointer;
  }
`;

const CommentSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  margin-top: 4px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  line-height: 18px;
  min-height: 56px;
  & form {
    display: flex;
    align-items: center;
    & > textarea {
      box-sizing: border-box;
      display: flex;
      flex-grow: 1;
      border: none;
      resize: none;
      color: #262626;
      min-heigth: 18px;
      max-height: 80px;
      line-height: 18px;
      &:focus {
        outline: none;
      }
    }
  }
`;

const IconButton = styled.div`
  ${buttonStyle}
  padding: 8px 16px 8px 0;
`;

const PostButton = styled.div`
  ${buttonStyle}
  color: #0095f6;
  font-weight: 600;
  text-align: center;
`;