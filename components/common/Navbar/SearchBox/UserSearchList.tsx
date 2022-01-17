import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import s from './UserSearchList.module.css';
import { ProfileImage } from 'components/profile';

import { BaseUser3 } from 'types/profile/types';
import styled from '@emotion/styled';

interface UserSearchListProps {
  userList: BaseUser3[];
  closeModal: () => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  userList,
  closeModal,
}) => {
  const router = useRouter();

  return (
    <Container>
      <h4>최근 검색 항목</h4>
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
    </Container>
  );
};

export default UserSearchList;

const Container = styled.div`
  position:fixed;
  top:56px;
  left: 50%;
  transform: translate(-50%,0);
  background-color: white;
  border-radius: 5px;
  width: 348px;
  height: 360px;
  overflow-y: scroll;
  text-align: left; 
`;

const UserBox = styled.div`
  display: flex;
  padding: 8px 16px;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: column;
    padding-right: 0.5rem;
    justify-content: center;
  }
`;