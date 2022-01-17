import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import s from './UserSearchList.module.css';
import { ProfileImage } from 'components/profile';

import styled from '@emotion/styled';
import UserSearchList from './UserSearchList';

const SearchBox: React.FC = () => {
  const [onUserList, setOnUserList] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCloseSearch = (e: any) => {
      if (!inputRef.current?.contains(e.target)) {
        if (onUserList && (!el.current || !el.current.contains(e.target))) {
          setOnUserList(false);
        }
      }
    };
    window.addEventListener('click', handleCloseSearch);
    return () => {
      window.removeEventListener('click', handleCloseSearch);
    };
  }, [onUserList]);

  return (
    <div>
      <Input
        ref={inputRef}
        onClick={() => {
          setOnUserList(true);
        }}
        type="text"
        placeholder="검색"
      />
      {onUserList && (
        <div ref={el}>
          <UserSearchList
            userList={[]}
            closeModal={() => setOnUserList(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;

const Input = styled.input`
  display: inline-block;
  background-color: #f8f8f8;
  border: 1px solid #e3e3e3;
  width: 208px;
  height: 24px;
  border-radius: 5%;
  text-align: center;
  font-size: 14px;
`;