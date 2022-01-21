import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ProfileImage } from 'components/profile';

import styled from '@emotion/styled';
import { BaseUser3 } from 'types/profile/types';
import axios from 'axios';
import { NEXT_SERVER } from 'config';
import { selectUser } from 'lib/redux/user/userSlice';
import { useSelector } from 'react-redux';
import { DeleteIcon } from 'components/ui/Icon';
import router from 'next/router';

interface UserSearchListProps {
  closeModal: () => void;
  inputText: string;
  userList: BaseUser3[];
  setUserList: (value: BaseUser3[]) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  closeModal,
  inputText,
  userList,
  setUserList
}) => {
  const { userInfo } = useSelector(selectUser);
  const [searchHistories, setSearchHistories] = useState<BaseUser3[]>([]);
  const deleteIconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    axios
      .get(`${NEXT_SERVER}/v1/profiles`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          }
        })
      .then((response) => {
        setSearchHistories(response.data);
      })
  }, [])

  const clickUser = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, username: string) => {
    closeModal();
    setUserList([]);
    if (username === userInfo.username) {
      return;
    } else {
      axios
        .put(`${NEXT_SERVER}/v1/profiles`,
          {
            searched: username
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.accessToken}`,
            }
          })
        .then((response) => {
          router.push(`/${username}`)
        })
    }
  }

  const clickSearchHistories = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, username: string) => {
    console.log(e.currentTarget, deleteIconRef.current?.parentNode)
    if (null !== deleteIconRef.current) {
      if (e.currentTarget?.contains(deleteIconRef.current.parentElement)) {
        console.log('제대로 찍으셨어요')
        return;
      }
    }
    closeModal();
    setUserList([]);
  }

  const deleteUser = (username: string) => {
    axios
      .delete(`${NEXT_SERVER}/v1/profiles/${username}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          }
        })
      .then((response) => {
        setSearchHistories(
          searchHistories.filter((user) => {
            user.username !== username
          }));
      })
  }

  const deleteUsers = () => {
    axios
      .delete(`${NEXT_SERVER}/v1/profiles`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          }
        })
      .then((response) => {
        setSearchHistories([]);
      });
  }

  useEffect(() => {
    console.log(searchHistories);
  }, [searchHistories]);


  return (
    <Container>
      <div>
        <Rhombus />
        <Wrapper>
          {inputText !== '' ?
            <>
              {userList.map((user) => {
                return (
                  <div
                    onClick={(e) => clickUser(e, user.username)}
                    key={user.name}
                  >
                    <UserBox>
                      <ImageWrapper>
                        <ProfileImage imageUrl={user.imageUrl} size="m" />
                      </ImageWrapper>
                      <ProfileIntro>
                        <span>
                          <b>{user.username}</b>
                        </span>
                        <span style={{ color: 'rgb(120,120,120)', fontSize: '14px' }}>
                          {user.name}
                        </span>
                      </ProfileIntro>
                    </UserBox>
                  </div>
                );
              })}
            </>
            :
            <>
              <Title>
                <h4>최근 검색 항목</h4>
                {searchHistories.length > 0 &&
                  <button onClick={deleteUsers}>모두 지우기</button>
                }
              </Title>
              {searchHistories.length > 0 ?
                searchHistories.map((user) => {
                  return (
                    <div
                      onClick={(e) => clickSearchHistories(e, user.username)}
                      key={user.name}
                    >
                      <UserBox>
                        <ImageWrapper>
                          <ProfileImage imageUrl={user.imageUrl} size="m" />
                        </ImageWrapper>
                        <ProfileIntro>
                          <span>
                            <b>{user.username}</b>
                          </span>
                          <span style={{ color: 'rgb(120,120,120)', fontSize: '14px' }}>
                            {user.name}
                          </span>
                        </ProfileIntro>
                        <IconWrapper>
                          <Button
                            ref={deleteIconRef}
                            onClick={() => deleteUser(user.username)}
                          >
                            <DeleteIcon searchBox={true} />
                          </Button>
                        </IconWrapper>
                      </UserBox>
                    </div>
                  );
                })
                :
                <NoHistory>
                  <div>
                    최근 검색 내역 없음.
                  </div>
                </NoHistory>
              }
            </>
          }
        </Wrapper>
      </div>
    </Container>
  );
};

export default React.memo(UserSearchList);

const Container = styled.div`
  position:fixed;
  top: 60px;
  left: 50%;
  transform: translate(-50%,0);
  background-color: white;
  border-radius: 5px;
  width: 378px;
  height: 360px;
  text-align: left; 
  & > div {
    height: 100%;
  }
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #fefefe;
  }
`;

const ImageWrapper = styled.div`
  padding-right: 8px;
`;


const ProfileIntro = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const IconWrapper = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  width: 32px;
  height: 32px;
  background-color: #FFF;
  padding: 0;
`;

const Rhombus = styled.div`
  width: 14px;
  height: 14px;
  bottom: 0;
  top: -6px;
  left: 50%;
  transform: translate(-50%,0);
  box-shadow: 0 0 5px 1px rgba(var(--jb7,0,0,0),.0975);
  position: absolute;
  transform: rotate(45deg);
  border: 1px solid rgba(var(--f23,255,255,255),1);
  background: #FFF;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFF;
  border-radius: 6px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 0 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 16px 0;
  max-height: 24px;
  & > h4 {
    display: block;
    font-size: 16px;
    font-weight: 600;
    ling-height: 24px;
    margin: 0;
  }
  & > button {
    background-color: #FFF;
    border: none;
    color: #0095F6;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const NoHistory = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;