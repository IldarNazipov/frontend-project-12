/* eslint-disable import/no-anonymous-default-export */
import { Provider } from 'react-redux';
import store from '../src/slices/index.js';
import { actions as channelsActions } from '../src/slices/channelsSlice.js';
import { actions as messagesActions } from '../src/slices/messagesSlice.js';
import { I18nextProvider } from 'react-i18next';
import App from './components/App.jsx';
import initiateI18n from './i18n.js';
import filter from 'leo-profanity';

export default async (socket) => {
  const ruWords = filter.getDictionary('ru');
  filter.add(ruWords);

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

  const i18next = await initiateI18n();

  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  );

  return vdom;
};
