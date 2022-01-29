import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './Navbar.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'lib/redux/user/userSlice';
import { setModal } from 'lib/redux/modal/modalSlice';
import ProfileImage from 'components/profile/ProfileImage';
import {
  HomeIcon,
  DirectIcon,
  ExploreIcon,
  FavoriteIcon,
  NewPostIcon,
  SearchIcon,
  BackIcon,
} from 'components/ui/Icon';
import SelectBox from './SelectBox';
import { useRouter } from 'next/router';
import { SearchBox } from './SearchBox';

const Navbar = () => {
  const { userInfo } = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [offModal, setOffModal] = useState<boolean>(false);
  const [onSelectBox, setOnSelectBox] = useState<boolean>(false);
  const [onSearch, setOnSearch] = useState<boolean>(false)
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>();
  const spanRef = useRef<any>();

  useEffect(() => {
    const handleCloseSelectBox = (e: any) => {
      if (!inputRef.current?.contains(e.target)) {
        if (
          onSelectBox &&
          (!selectBoxRef.current || !selectBoxRef.current.contains(e.target))
        ) {
          setOnSelectBox(false);
        }
      }
    };
    window.addEventListener('click', handleCloseSelectBox);
    return () => {
      window.removeEventListener('click', handleCloseSelectBox);
    };
  }, [onSelectBox]);

  useEffect(() => {
    if (offModal) {
      setOnSelectBox(false);
      setOffModal(false);
    }
  }, [offModal]);

  return (
    <>
      <div className={s.paper}>
        <div className={s.navigator}>
          {
            onSearch ?
              <>
                <div onClick={() => setOnSearch(false)}>
                  <BackIcon />
                </div>
                <SearchBox media={true} />
                <div style={{ width: '24px' }}></div>
              </>
              :
              <>
                <Link href="/">
                  <a className={s.mainlogo}>
                    <Image
                      src={'/stargram.png'}
                      width={'103px'}
                      height={'20px'}
                      alt={'mainlogo'}></Image>
                  </a>
                </Link>
                <SearchBox media={false} />
                <div className={s.right}>
                  <div className={s.rightBanner}>
                    <Link href="/">
                      <a>
                        <HomeIcon
                          on={router.asPath === '/' && !onSelectBox}
                        />
                      </a>
                    </Link>

                    <div
                      className={s.searchIconWrapper}
                      onClick={() => setOnSearch(true)}>
                      <div>
                        <SearchIcon navbar={true} />
                      </div>
                    </div>

                    {/* <Link href="/direct">
                      <a>
                        <DirectIcon />
                      </a>
                    </Link> */}

                    <Link href="/explore">
                      <a>
                        <ExploreIcon
                          on={router.asPath === '/explore' && !onSelectBox}
                        />
                      </a>
                    </Link>

                    {/* <div>
                      <FavoriteIcon />
                    </div> */}

                    <div onClick={() => dispatch(setModal('newPost', true))}>
                      <div>
                        <NewPostIcon />
                      </div>
                    </div>

                    {/* TODO:누르면 메뉴바 나오도록 */}
                    <div>
                      <span
                        ref={spanRef}
                        onClick={() => {
                          setOnSelectBox(true);
                        }}
                        style={{ display: 'flex', transform: 'translateY(-2px)' }}>
                        <ProfileImage
                          size={'nav'}
                          border={
                            router.asPath !== '/'
                            && router.asPath !== '/explore'
                            || onSelectBox
                          }
                          borderColor={'black'}
                          imageUrl={userInfo.profileImageUrl}
                        />
                      </span>
                      {onSelectBox && (
                        <div ref={selectBoxRef}>
                          <SelectBox
                            closeModal={() => setOffModal(true)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
          }
        </div>
      </div>
    </>
  );
};

export default Navbar;
