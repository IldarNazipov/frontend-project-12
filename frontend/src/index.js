import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import store from '../src/slices/index.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';
import { io } from 'socket.io-client';
import { actions as channelsActions } from '../src/slices/channelsSlice.js';
import { actions as messagesActions } from '../src/slices/messagesSlice.js';

export const socket = io();

const app = async () => {
  const i18next = await i18n;
  const container = document.getElementById('root');
  const root = createRoot(container);
  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsActions.removeChannel({ channelId: payload.id }));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(
      channelsActions.renameChannel({
        channelId: payload.id,
        channelName: payload.name,
      })
    );
  });

  root.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18next} defaultNS={'translation'}>
        <App />
      </I18nextProvider>
    </Provider>
  );
};

app();
