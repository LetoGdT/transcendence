import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io(`${process.env.REACT_APP_NESTJS_HOSTNAME}`, { transports: ['websocket'] });
export const websocketContext = createContext<Socket>(socket);
export const websocketProvider = websocketContext.Provider;
