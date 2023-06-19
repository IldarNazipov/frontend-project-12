/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash.remove';
import filter from 'leo-profanity';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [] },
  reducers: {
    setCurrentChannelId(state, { payload }) {
      state.currentChannelId = payload;
    },
    addChannel(state, { payload }) {
      const cleanedText = filter.clean(payload.name);
      const cleanedPayload = { ...payload, name: cleanedText };
      state.channels.push(cleanedPayload);
    },
    addChannels(state, { payload }) {
      if (payload.length > 0) {
        const cleanedPayload = payload.map((channel) => {
          const cleanedText = filter.clean(channel.name);
          return { ...channel, name: cleanedText };
        });
        state.channels = cleanedPayload;
      } else {
        state.channels = payload;
      }
    },
    removeChannel(state, { payload }) {
      const { channelId } = payload;
      if (channelId === state.currentChannelId) {
        state.currentChannelId = 1;
      }
      remove(state.channels, ({ id }) => id === channelId);
    },
    renameChannel(state, { payload }) {
      const { channelId, channelName } = payload;
      const channel = state.channels.find(({ id }) => id === channelId);
      const cleanedName = filter.clean(channelName);
      channel.name = cleanedName;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
