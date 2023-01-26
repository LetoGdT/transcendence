import {WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		MessageBody,
		WebSocketServer,
		ConnectedSocket,
		WsException
} from '@nestjs/websockets';
import { Server,
		 Socket,
} from 'socket.io';
import { parse } from "cookie";
import { AuthService } from '../auth/auth.service';
import { User } from '../typeorm/user.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { Connection } from '../interfaces/connection.interface';
import { Game } from './game/game.class';

@WebSocketGateway(9998, { cors: true })
export class MySocketGateway implements OnGatewayConnection, 
										OnGatewayDisconnect {
	constructor(private readonly auth: AuthService,
				private readonly chat: ChatService,
				private readonly usersService: UsersService,
			   	private clients: Connection[]) {}

	@WebSocketServer()
	server: Server;

	queue = new Map<number, Connection[]>();
	games: Game[] = [];

	async handleConnection(client: Socket) {
		// Vérification du token de l’utilisateur
		// Si le token est invalide, la socket est fermée de suite
		if (client.request.headers.cookie == undefined)
		{
			client.disconnect();
			return ;
		}
		const cookies = parse(client.request.headers.cookie);
		if(cookies.access_token == null || await !this.auth.verifyToken(cookies.access_token)) {
			client.disconnect();
			return ;
		}
		const user = await this.auth.tokenOwner(cookies.access_token);
		if (user == null)
		{
			client.disconnect();
			return ;
		}

		this.clients.push({user, client});
		await this.usersService.changeUserStatus(user.id, 'online');
		console.log(user.username + " has connected to the websocket");
	}

	async handleDisconnect(client: Socket) {
		let index = this.clients.findIndex(element => element.client == client);
		if (index != -1) {
			console.log(this.clients[index].user.username + " has disconnected from the websocket.");
			await this.usersService.changeUserStatus(this.clients[index].user.id, 'offline');
			this.clients.splice(index, 1);
		}
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		let {users, latest_sent} = await this.chat.onNewMessage(body.chanOrConv, body.isChannel, parse(client.handshake.headers.cookie).access_token);
		let convId: number = body.convId;
		for (var user of users) {
			for (var connection of this.clients) {
				if (user == connection.user.id) {
					connection.client.emit("newMessage", {convId, latest_sent});
					continue ;
				}
			}
		}
	}


	@SubscribeMessage('newConv')
	async onNewConv(@MessageBody() body: any) {
		for (var connection of this.clients) {
			if (connection.user.id === body?.id) {
				connection.client.emit("newConv");
				continue ;
			}
		}
	}

	@SubscribeMessage('moveUp')
	moveUp(@MessageBody() body: any,
		@ConnectedSocket() client: Socket,)
	{
		const index: number = this.games.findIndex(game => game.getPlayer1Socket().id == client.id
			|| game.getPlayer2Socket().id == client.id);

		if (index === -1)
			throw new WsException('You are not in a game');

		const game = this.games[index];
	}

	@SubscribeMessage('queue')
	queueGame(@MessageBody() body: any,
		@ConnectedSocket() client: Socket,)
	{
		console.log('Queue initiated');
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');
		const client_exp = this.clients[index].user.exp;
		this.queue.set(client_exp, [...this.clients, this.clients[index]]);
		return this.clients[index];
	}
}
