import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash.remove';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [] },
  reducers: {
    setCurrentChannelName(state, { payload }) {
      state.currentChannelName = payload;
    },
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
    addChannels(state, { payload }) {
      state.channels = payload;
    },
    removeChannel(state, { payload }) {
      const { channelId } = payload;
      remove(state.channels, ({ id }) => id === channelId);
    },
    renameChannel(state, { payload }) {
      const { channelId, channelName } = payload;
      const channel = state.channels.find(({ id }) => id === channelId);
      channel.name = channelName;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
