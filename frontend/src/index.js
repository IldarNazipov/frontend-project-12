import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import store from '../src/slices/index.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <App />
    </I18nextProvider>
  </Provider>
);
