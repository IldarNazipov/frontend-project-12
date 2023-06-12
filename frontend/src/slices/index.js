import { configureStore } from '@reduxjs/toolkit';
import userdataReducer from './userdataSlice.js';

export default configureStore({
  reducer: {
    userdata: userdataReducer,
  },
});
