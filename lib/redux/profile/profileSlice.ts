import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Banner, Board, UserData } from 'types/profile/types';
import { getProfileData } from './profileApis';

interface ProfileSliceProps {
  currentBanner: Banner;
  userData: UserData;
  boardData: Board[];
}

const initialState: ProfileSliceProps = {
  currentBanner: 'main',
  userData: {
    id: '',
    name: '',
    board: 0,
    follower: [],
    following: [],
    webSite: '',
    email: '',
    phone: '',
    introduce: '',
    imageUrl: '',
    sex: '비공개',
  },
  boardData: [],
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    SET_BANNER: (state, action: PayloadAction<Banner>) => {
      state.currentBanner = action.payload;
    },
    SET_USER_DATA: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    SET_BOARD_DATA: (state, action: PayloadAction<Board[]>) => {
      state.boardData = action.payload;
    },
  },
});

export const { SET_BANNER, SET_USER_DATA, SET_BOARD_DATA } =
  profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile;

export default profileSlice.reducer;

export function setBanner(banner: Banner) {
  return (dispatch: any) => {
    try {
      dispatch(SET_BANNER(banner));
    } catch (error) {}
  };
}

export function initialBanner() {
  return (dispatch: any) => {
    dispatch(SET_BANNER('main'));
  };
}

export function setBoardData(data: Board[]) {
  return async (dispatch: any) => {
    dispatch(SET_BOARD_DATA(data));
  };
}

export function setUserData(data: UserData) {
  return async (dispatch: any) => {
    dispatch(SET_USER_DATA(data));
  };
}
