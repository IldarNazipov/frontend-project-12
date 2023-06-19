import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash.remove';
import filter from 'leo-profanity';
import { actions as channelsActions } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    addMessages(state, { payload }) {
      if (payload.length > 0) {
        const cleanedPayload = payload.map((message) => {
          const cleanedText = filter.clean(message.body);
          return { ...message, body: cleanedText };
        });
        state.messages = cleanedPayload;
      } else {
        state.messages = payload;
      }
    },
    addMessage(state, { payload }) {
      const cleanedText = filter.clean(payload.body);
      const cleanedPayload = { ...payload, body: cleanedText };
      state.messages.push(cleanedPayload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, { payload }) => {
      const { channelId } = payload;
      remove(state.messages, (message) => message.channelId === channelId);
    });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
