import {
	SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Connection } from '../interfaces/connection.interface';
import { User } from '../typeorm/user.entity';

@WebSocketGateway(9997, { cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(private readonly auth: AuthService,
		private clients: Connection[]) {}

	async handleConnection(client: Socket) {
		// Vérification du token de l’utilisateur
		// Si le token est invalide, la socket est fermée de suite
		if(typeof client.request.headers.cookie === 'undefined' || !this.auth.verifyToken(client.request.headers.cookie)) {
			client.disconnect();
			return ;
		}
		let token = client.request.headers.cookie;
		let user = await this.auth.tokenOwner(token);
		this.clients.push({user, client});
	}

	async handleDisconnect(client: Socket) {
		let index = this.clients.findIndex(element => element.client == client);
		if (index != -1)
			this.clients.splice(index, 1);
	}

	// @SubscribeMessage('')
}
