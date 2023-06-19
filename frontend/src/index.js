import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { io } from 'socket.io-client';
import { Provider, ErrorBoundary } from '@rollbar/react';
import init from './init.js';

export const socket = io();

const rollbarConfig = {
  accessToken: '7ca276920bc140f69cc97995d68e751f',
  environment: 'production',
};

const app = async () => {
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
