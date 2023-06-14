import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getChatData: (state, { payload }) => {
      state.entities = payload;
    },
  },
});

export const { getChatData } = chatSlice.actions;
export default chatSlice.reducer;
