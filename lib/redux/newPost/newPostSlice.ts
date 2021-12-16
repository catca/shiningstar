import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NewPostSliceProps {
  id: number;
  image: string;
  croppedImage: string;
  croppedAreaPixel: {
    width: number,
    height: number,
    x: number,
    y: number
  }
}

interface UpdateCroppedImage {
  id: number;
  croppedImage: string;
}

const initialState: NewPostSliceProps[] = [{
  id: 1,
  image: '',
  croppedImage: '',
  croppedAreaPixel: {
    width: 0,
    height: 0,
    x: 0,
    y: 0
  }
}];

export const newPostSlice = createSlice({
  name: 'newPost',
  initialState,
  reducers: {
    INIT_POST_IMAGE: (state) => {
      state = initialState;
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
    UPDATE_CROPPED_AREA_PIXEL: (state, action: PayloadAction<any>) => {
      state[action.payload.id - 1].croppedAreaPixel.width = action.payload.width;
      state[action.payload.id - 1].croppedAreaPixel.height = action.payload.height;
      state[action.payload.id - 1].croppedAreaPixel.x = action.payload.x;
      state[action.payload.id - 1].croppedAreaPixel.y = action.payload.y;
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

export const updateCroppedAreaPixel = (data: any) => {
  return async (dispatch: any) => {
    dispatch(UPDATE_CROPPED_AREA_PIXEL(data));
  };
};

export const { INIT_POST_IMAGE, SET_POST_IMAGE, ADD_POST_IMAGE, UPDATE_CROPPED_IMAGE, UPDATE_CROPPED_AREA_PIXEL } = newPostSlice.actions;
export const selectNewPost = (state: RootState) => state.newPost;

export default newPostSlice.reducer;
