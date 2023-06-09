import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { io } from 'socket.io-client';
import { Provider, ErrorBoundary } from '@rollbar/react';
import init from './init.js';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: 'production',
};

const app = async () => {
  const socket = io();
  const container = document.getElementById('root');
  const root = createRoot(container);
  const vdom = await init(socket);

  root.render(
    <React.StrictMode>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>{vdom}</ErrorBoundary>
      </Provider>
    </React.StrictMode>,
  );
};

app();
