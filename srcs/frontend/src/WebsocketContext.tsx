import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io('http://localhost:9998');
export const websocketContext = createContext<Socket>(socket);
export const websocketProvider = websocketContext.Provider;
