import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import s from './UserSearchList.module.css';
import { ProfileImage } from 'components/profile';

import styled from '@emotion/styled';
import UserSearchList from './UserSearchList';
import { SearchIcon } from 'components/ui/Icon';

const SearchBox: React.FC = () => {
  const [onUserList, setOnUserList] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCloseSearch = (e: any) => {
      if (!inputRef.current?.contains(e.target)) {
        if (onUserList && (!el.current || !el.current.contains(e.target))) {
          setOnUserList(false);
          setInputFocus(false);
        }
      }
    };
    window.addEventListener('click', handleCloseSearch);
    return () => {
      window.removeEventListener('click', handleCloseSearch);
    };
  }, [onUserList]);

  useEffect(() => {
    console.log(inputFocus);
  }, [inputFocus])

  return (
    <Container onClick={() => setInputFocus(true)}>
      <Input
        ref={inputRef}
        onClick={() => {
          setOnUserList(true);
        }}
        type="text"
        placeholder={inputFocus ? "검색" : undefined}
      />
      {inputFocus ? null :
        <SearchIconWrapper>
          <div>
            <SearchIcon />
          </div>
          <span>
            검색
          </span>
        </SearchIconWrapper>
      }
      {onUserList && (
        <div ref={el}>
          <UserSearchList
            closeModal={() => setOnUserList(false)}
          />
        </div>
      )}
    </Container>
  );
};

export default SearchBox;

const Container = styled.div`
  position: relative;
`;

const Input = styled.input`
  display: inline-block;
  background-color: #EFEFEF;
  box-sizing: border-box;
  border: none;
  outline: none;
  width: 268px;
  height: 36px;
  border-radius: 8px;
  font-size: 16px;
  padding: 3px 16px;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  position: absolute;
  height: 36px;
  padding: 0 16px;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  & > span {
    color: #8e8e8e;
    height: 22px;
    line-height: 18px;
  }
  & > div {
    margin-right: 12px
  }
`;