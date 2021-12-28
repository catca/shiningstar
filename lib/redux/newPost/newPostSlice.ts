import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface NewPostSliceProps {
  id: number;
  exist: boolean;
  image: string;
  croppedImage: string;
  croppedAreaPixel: {
    width: number | unknown,
    height: number | unknown,
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
  exist: false,
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
      while (state.length > 1) {
        state.pop();
      }
      state[0] = initialState[0];
    },
    SET_POST_IMAGE: (state, action: PayloadAction<string>) => {
      state[0].image = action.payload;
    },
    ADD_POST_IMAGE: (state, action: PayloadAction<any>) => {
      console.log(action.payload)
      state.push({
        id: action.payload.id,
        exist: false,
        image: action.payload.image,
        croppedImage: '',
        croppedAreaPixel: {
          width: 0,
          height: 0,
          x: 0,
          y: 0
        }
      })
    },
    UPDATE_CROPPED_IMAGE: (state, action: PayloadAction<UpdateCroppedImage>) => {
      console.log(action.payload.id - 1)
      state[action.payload.id - 1].croppedImage = action.payload.croppedImage;
    },
    UPDATE_CROPPED_AREA_PIXEL: (state, action: PayloadAction<any>) => {
      state[action.payload.id - 1].croppedAreaPixel.width = action.payload.width;
      state[action.payload.id - 1].croppedAreaPixel.height = action.payload.height;
      state[action.payload.id - 1].croppedAreaPixel.x = action.payload.x;
      state[action.payload.id - 1].croppedAreaPixel.y = action.payload.y;
      state[action.payload.id - 1].exist = true;
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

export const addPostImage = (data: any) => {
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
