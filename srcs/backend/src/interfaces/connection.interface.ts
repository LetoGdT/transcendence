import { User } from '../typeorm/user.entity';
import { Socket } from 'socket.io';
export interface Connection {
	user: User;
	client: Socket;
}