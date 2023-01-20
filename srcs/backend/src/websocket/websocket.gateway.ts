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
	onNewMessage(client: Socket, @MessageBody() body: any) {
		// il faut envoyer le message à la bonne personne et le mettre dans la bdd
	}

	@SubscribeMessage('getMoreMessages')
	getMoreMessages(client: Socket, @MessageBody() othersId: {id: number}) {
	}

	@SubscribeMessage('getTailMessages')
	getTailMessages(client: Socket, @MessageBody() id: number) {
		let cookie = client.request.headers.cookie;
		return this.chat.getTailMessages(id, cookie);
	}

	@SubscribeMessage('deleteMessages')
	deleteMessages(client: Socket, @MessageBody() messageId: {id: number}) {
	}

	@SubscribeMessage('modifyMessages')
	modifyMessages(client: Socket, @MessageBody() messageId: {id: number}) {
	}

	@SubscribeMessage('getConversations')
	getConversations(client: Socket) {
	}

	sendMessage(recipient: Socket) {
	}

	@SubscribeMessage('moveUp')
	moveUp(@ConnectedSocket() client: Socket,)
	{
		if (this.games == null)
			throw new WsException('No game created');

		const index: number = this.games.findIndex(game => game.getPlayer1Socket().id == client.id
			|| game.getPlayer2Socket().id == client.id);

		if (index === -1)
			throw new WsException('You are not in a game');

		const game = this.games[index];

		if (game.getPlayer1Socket().id == client.id)
			game.player1Up();
		else game.player2Up();
	}

	@SubscribeMessage('moveDown')
	moveDown(@ConnectedSocket() client: Socket,)
	{
		if (this.games == null)
			throw new WsException('No game created');

		const index: number = this.games.findIndex(game => game.getPlayer1Socket().id == client.id
			|| game.getPlayer2Socket().id == client.id);

		if (index === -1)
			throw new WsException('You are not in a game');

		const game = this.games[index];
		if (game.getPlayer1Socket().id == client.id)
			game.player1Up();
		else game.player2Up();
	}

	// Think that non ranked dont join a queue
	@SubscribeMessage('queue')
	queueGame(@MessageBody() body: {
		type: 'Ranked' | 'Quick play',
		opponent_id?: number,
		ball_speed?: number,
		winning_score?: number,
		},
		@ConnectedSocket() client: Socket,)
	{
		console.log('Queue initiated');
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const gameIndex: number = this.games.findIndex(game => {
			game.getPlayer1Id() == body.opponent_id && game.started()
			|| game.getPlayer1Id() == this.clients[index].user.id && game.started()
			|| game.getPlayer2Id() == body.opponent_id && game.started()
			|| game.getPlayer2Id() == this.clients[index].user.id && game.started()
		});

		if (gameIndex !== -1)
			throw new WsException('You are already in a game');

		if (body.type == 'Ranked')
		{
			const client_exp = this.clients[index].user.exp;
			const opponent: Connection | null = this.chat.searchOpponent(this.queue, client_exp);
			if (opponent != null)
			{
				this.chat.startGame(this.clients[index], opponent, this.games);
				return ;
			}
			this.queue.set(client_exp, [...this.clients, this.clients[index]]);
			client.emit('queuing');
		}
		else
		{
			if (body.opponent_id == null)
				throw new WsException('You must provide an opponent');

			const opponentIndex: number = this.clients.findIndex(connection => {
				connection.client.id == client.id
			});

			if (opponentIndex === -1)
				throw new WsException('Opponent not connected');

			const game = new Game(50, 'Quick play');
			game.setWinningScore(body.winning_score);
			game.setBallSpeed(body.ball_speed);
			game.addPlayer({ user: this.clients[index].user, client: client });
			game.addPlayer({ user: this.clients[opponentIndex].user,
				client: this.clients[opponentIndex].client });
			this.games.push(game);
			client.emit('waitingForOpponent');
		}
	}

	@SubscribeMessage('respondToInvite')
	respondToInvite(@ConnectedSocket() client: Socket)
	{
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		let gameIndex: number = this.games.findIndex(game => {
			game.getPlayer1Id() == this.clients[index].user.id && game.started()
			|| game.getPlayer2Id() == this.clients[index].user.id && game.started()
		});

		if (gameIndex !== -1)
			throw new WsException('You are already in a game');

		gameIndex = this.games.findIndex(game => {
			game.getPlayer1Id() == this.clients[index].user.id
			|| game.getPlayer2Id() == this.clients[index].user.id
		});

		if (gameIndex === -1)
			throw new WsException('You have not been invited in a game');

		const game = this.games[gameIndex];
		game.run();
	}
}
