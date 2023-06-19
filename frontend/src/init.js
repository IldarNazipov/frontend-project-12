import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import filter from 'leo-profanity';
import store from './slices/index.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import App from './components/App.jsx';
import { SocketContext } from './contexts/index.js';
import initiateI18n from './i18n.js';

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
      }),
    );
  });

  const sendMessage = (body, channelId, username) => new Promise((resolve, reject) => {
    socket.emit('newMessage', { body, channelId, username }, (response) => {
      if (response && response.status === 'ok') {
        resolve();
      } else {
        reject();
      }
    });

    setTimeout(() => {
      reject(new Error('Server response timed out'));
    }, 5000);
  });

  const addChannel = (name) => new Promise((resolve, reject) => {
    socket.emit('newChannel', { name }, (response) => {
      if (response && response.status === 'ok') {
        resolve(response);
      } else {
        reject();
      }
    });

    setTimeout(() => {
      reject(new Error('Server response timed out'));
    }, 5000);
  });

  const renameChannel = (id, name) => new Promise((resolve, reject) => {
    socket.emit('renameChannel', { id, name }, (response) => {
      if (response && response.status === 'ok') {
        resolve();
      } else {
        reject();
      }
    });

    setTimeout(() => {
      reject(new Error('Server response timed out'));
    }, 5000);
  });

  const removeChannel = (id) => new Promise((resolve, reject) => {
    socket.emit('removeChannel', { id }, (response) => {
      if (response && response.status === 'ok') {
        resolve();
      } else {
        reject();
      }
    });

    setTimeout(() => {
      reject(new Error('Server response timed out'));
    }, 5000);
  });

  const i18next = await initiateI18n();

  const vdom = (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <SocketContext.Provider value={{
          sendMessage,
          addChannel,
          renameChannel,
          removeChannel,
        }}
        >
          <App />
        </SocketContext.Provider>
      </I18nextProvider>
    </Provider>
  );

  return vdom;
};
