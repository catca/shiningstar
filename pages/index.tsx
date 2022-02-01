/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'lib/redux/user/userSlice';
import { Container } from 'components/ui/Container';
import Footer from 'components/main/Footer';
import styled from '@emotion/styled';
import Post from 'components/main/Post';
import { LoginPage } from './login';

import axios from 'axios';
import { NEXT_SERVER } from 'config';
import { useState } from 'react';
import { BoardModal, Modal } from 'components/modal';
import { selectModal } from 'lib/redux/modal/modalSlice';
import { ModalDataType } from 'types/modal/types';

const Main = ({ }) => {
  const { login, userInfo } = useSelector(selectUser);
  const { showBoardModal, showModal } = useSelector(selectModal);
  const [mainData, setMainData] = useState([]);
  const dispatch = useDispatch();
  const favoriteModal: ModalDataType[] = [{ name: '좋아요', link: undefined }];

  useEffect(() => {
    if (userInfo.accessToken) {
      axios
        .get(`${NEXT_SERVER}/v1/main`, {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        })
        .then((response) => {
          setMainData(response.data);
          // dispatch(setUserData(response.data));
        });
    }
  }, [userInfo]);

  return (
    <>
      <Head>
        <title>instagram</title>
        <meta name="description" content="instagram" />
      </Head>
      {login ? (
        mainData.length > 1 ?
          <Container>
            <main>
              <Section>
                <div>
                  {mainData.map((postData, index) => {
                    return (
                      <Post
                        key={index}
                        postData={postData}
                        setMainData={setMainData}
                        mainData={mainData}
                      />
                    );
                  })}
                </div>
                <div>
                  <Footer />
                </div>
              </Section>
            </main>
          </Container>
          :
          <div style={{ position: 'relative', backgroundColor: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
            <img alt='loadingLogo' src='/stargram.png' width='280px' height='40px' />
          </div>
      ) : (
        <LoginPage />
      )}
      {showBoardModal && <BoardModal />}
      {showModal.favorite && <Modal modalData={favoriteModal} />}
    </>
  );
};

export default Main;

const Section = styled.section`
  max-width: 935px;
  padding-top: 84px;
  display: flex;
  justify-content: center;
  & > div:first-of-type {
    float: left;
    margin-right: 28px;
    max-width: 614px;
    width: 100%;
    @media (max-width: 998px) {
      margin: 0;
    }
  }
  & > div:last-of-type {
    max-width: 293px;
  }
`;
