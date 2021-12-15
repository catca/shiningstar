import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NewPostSliceProps {
  id: number;
  image: string;
  croppedImage: string;
}

interface UpdateCroppedImage {
  id: number;
  croppedImage: string;
}

const initialState: NewPostSliceProps[] = [{
  id: 1,
  image: '',
  croppedImage: '',
}];

export const newPostSlice = createSlice({
  name: 'newPost',
  initialState,
  reducers: {
    INIT_POST_IMAGE: (state) => {
      state[0].image = '';
      state[0].croppedImage = '';
    },
    SET_POST_IMAGE: (state, action: PayloadAction<string>) => {
      state[0].image = action.payload;
    },
    ADD_POST_IMAGE: (state, action: PayloadAction<string>) => {
      state[0].image = action.payload;
    },
    UPDATE_CROPPED_IMAGE: (state, action: PayloadAction<UpdateCroppedImage>) => {
      state[action.payload.id - 1].croppedImage = action.payload.croppedImage;
    },
  },
});

export const initPostImage = () => {
  return async (dispatch: any) => {
    dispatch(INIT_POST_IMAGE());
  };
};

export const setPostImage = (data: string) => {
  return async (dispatch: any) => {
    dispatch(SET_POST_IMAGE(data));
  };
};

export const addPostImage = (data: string) => {
  return async (dispatch: any) => {
    dispatch(ADD_POST_IMAGE(data));
  };
};

export const updateCroppedImage = (data: UpdateCroppedImage) => {
  return async (dispatch: any) => {
    dispatch(UPDATE_CROPPED_IMAGE(data));
  };
};

export const { INIT_POST_IMAGE, SET_POST_IMAGE, ADD_POST_IMAGE, UPDATE_CROPPED_IMAGE } = newPostSlice.actions;
export const selectNewPost = (state: RootState) => state.newPost;

export default newPostSlice.reducer;
