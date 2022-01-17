import React, { useState } from 'react';
import Link from 'next/link';
import { ProfileImage } from 'components/profile';

import styled from '@emotion/styled';

interface UserSearchListProps {
  closeModal: () => void;
}

interface UserProps {
  username: string;
  name: string;
  imageUrl: string;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ closeModal }) => {
  const [userList, setUserList] = useState<UserProps[]>([])

  return (
    <Container>
      <div>
        <Rhombus />
        <Wrapper>
          <Title>
            <h4>최근 검색 항목</h4>
            <button>모두 지우기</button>
          </Title>
          {userList.map((user) => {
            return (
              <Link href={`/${user.username}`} key={user.name}>
                <a onClick={closeModal}>
                  <UserBox>
                    <ProfileImage imageUrl={user.imageUrl} size="m" />
                    <div>
                      <span>
                        <b>{user.username}</b>
                      </span>
                      <span style={{ color: 'rgb(120,120,120)', fontSize: '14px' }}>
                        {user.name}
                      </span>
                    </div>
                  </UserBox>
                </a>
              </Link>
            );
          })}
        </Wrapper>
      </div>
    </Container>
  );
};

export default UserSearchList;

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
`;

const UserBox = styled.div`
  display: flex;
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #fefefe;
  }
  & > div {
    display: flex;
    flex-direction: column;
    padding-right: 0.5rem;
    justify-content: center;
  }
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
  }
`;