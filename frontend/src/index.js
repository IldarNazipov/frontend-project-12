import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { io } from 'socket.io-client';
import init from './init.js';

export const socket = io();

const app = async () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  const vdom = await init(socket);

  root.render(<React.StrictMode>{vdom}</React.StrictMode>);
};

app();
