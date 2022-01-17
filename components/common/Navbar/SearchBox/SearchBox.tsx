import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import UserSearchList from './UserSearchList';
import { SearchIcon } from 'components/ui/Icon';

const SearchBox: React.FC = () => {
  const [onUserList, setOnUserList] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const el = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCloseSearch = (e: CustomEvent<MouseEvent>) => {
      if (!inputRef.current?.contains(e.target as Element)) {
        if (onUserList && (!el.current || !el.current.contains(e.target as Element))) {
          setOnUserList(false);
          setInputFocus(false);
          setInputText("");
        }
      }
    };
    window.addEventListener('click', (handleCloseSearch) as EventListener);
    return () => {
      window.removeEventListener('click', (handleCloseSearch) as EventListener);
    };
  }, [onUserList]);

  const deleteInputText = () => {
    setOnUserList(false);
    setInputFocus(false);
    setInputText("");
  }

  const inputClick = (e: CustomEvent<MouseEvent>) => {
    if (deleteIconRef.current?.contains(e.target as Element)) return;
    setInputFocus(true);
    setOnUserList(true);
    if (null !== inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <Container onClick={(e) => inputClick(e)}>
      <div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={inputFocus ? "검색" : undefined}
          value={inputText}
          onChange={(e: { target: { value: string } }) => setInputText(e.target.value)}
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
        {inputFocus &&
          <DeleteIcon
            ref={deleteIconRef}
            onClick={() => deleteInputText()}
            style={{ backgroundImage: `url(/instagramIcon.png)` }}
          />
        }
        {onUserList && (
          <div ref={el}>
            <UserSearchList
              closeModal={() => setOnUserList(false)}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default SearchBox;

const Container = styled.div`
  cursor: text;
  & > div {
    position: relative;
  }
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

const DeleteIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  background-position: -318px -333px;
  height: 20px;
  width: 20px;
  background-repeat: no-repeat;
  cursor: default;
`;