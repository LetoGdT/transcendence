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
import { MatchesService } from '../matches/matches.service';
import { Connection } from '../interfaces/connection.interface';
import { Game } from './game/game.class';
import { CreateMatchDto } from '../dto/matches.dto';

@WebSocketGateway(9998, { cors: true })
export class MySocketGateway implements OnGatewayConnection, 
										OnGatewayDisconnect {
	constructor(private readonly auth: AuthService,
				private readonly chat: ChatService,
				private readonly usersService: UsersService,
				private readonly matchesService: MatchesService,
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
	}

	async handleDisconnect(client: Socket) {
		let index = this.clients.findIndex(element => element.client == client);
		if (index != -1) {
			const connections = this.queue.get(this.clients[index].user.exp);
			if (connections != null)
			{
				const conn_id = connections.findIndex(conn => {
					conn.user.id == this.clients[index].user.id;
				});
				if (conn_id != -1)
					this.queue.get(this.clients[index].user.exp).splice(conn_id, 1);
			}
			await this.usersService.changeUserStatus(this.clients[index].user.id, 'offline');
			for (let game of this.games)
				game.removeSpectator(this.clients[index]);
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

	@SubscribeMessage('spectate')
	async spectate(@ConnectedSocket() client: Socket, @MessageBody() body: {
			player1_id: number,
			player2_id: number,
		})
	{
		for (let game of this.games)
		{
			if (await game.getPlayer1Id() == body.player1_id
				&& await game.getPlayer2Id() == body.player2_id)
			{
				const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
				game.addSpectator(this.clients[index]);
				break;
			}
		}
	}

	@SubscribeMessage('getGames')
	async getGames(@ConnectedSocket() client: Socket)
	{
		console.log('getGames');
		const games: { player1_id: number, player2_id: number }[] = [];
		for (let game of this.games)
			games.push({
				player1_id: await game.getPlayer1Id(),
				player2_id: await game.getPlayer2Id(),
			});
		client.emit('returnGames', games);
		return games;
	}

	@SubscribeMessage('moveUp')
	async moveUp(@ConnectedSocket() client: Socket,)
	{
		if (this.games == null)
			throw new WsException('No game created');

		const index: number = this.games.findIndex(async game => (await game.getPlayer1Socket()).id == client.id
			|| (await game.getPlayer2Socket()).id == client.id);

		if (index === -1)
			throw new WsException('You are not in a game');

		const game = this.games[index];

		if ((await game.getPlayer1Socket()).id == client.id)
			await game.player1Up();
		else
			await game.player2Up();
	}

	@SubscribeMessage('moveDown')
	async moveDown(@ConnectedSocket() client: Socket,)
	{
		if (this.games == null)
			throw new WsException('No game created');

		const index: number = this.games.findIndex(async game => (await game.getPlayer1Socket()).id == client.id
			|| (await game.getPlayer2Socket()).id == client.id);

		if (index === -1)
			throw new WsException('You are not in a game');

		const game = this.games[index];

		if ((await game.getPlayer1Socket()).id == client.id)
			await game.player1Down();
		else
			await game.player2Down();
	}

	@SubscribeMessage('queue')
	async queueGame(@MessageBody() body: {
		type: 'Ranked' | 'Quick play',
		opponent_id?: number,
		ball_speed?: number,
		winning_score?: number,
		},
		@ConnectedSocket() client: Socket,)
	{
		// this.chat.printQ(this.queue);
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const gameIndex: number = this.games.findIndex(async game => {
			await game.getPlayer1Id() == body.opponent_id && await game.started()
			|| await game.getPlayer1Id() == this.clients[index].user.id && await game.started()
			|| await game.getPlayer2Id() == body.opponent_id && await game.started()
			|| await game.getPlayer2Id() == this.clients[index].user.id && await game.started()
		});

		if (gameIndex !== -1)
		{
			const game = this.games[gameIndex];
			if (await game.getPlayer1Id() == this.clients[index].user.id)
				game.setPlayer1Socket(client);
			else
				game.setPlayer2Socket(client);
			client.emit('gameFound');
		}

		if (body.type == 'Ranked')
		{
			const client_exp = this.clients[index].user.exp;

			for (let connections of this.queue.values())
			{
				for (let connection of connections)
				{
					if (connection.user.id == this.clients[index].user.id)
					{
						throw new WsException('You are already in queue');
					}
				}
			}

			const opponent: Connection | null = this.chat.searchOpponent(this.queue, client_exp,
				this.clients[index].user.id);
			if (opponent != null)
			{
				await this.chat.startGame(this.clients[index], opponent, this.games);
				return ;
			}
			if (this.queue.get(client_exp) != null)
				this.queue.get(client_exp).push(this.clients[index]);
			else
				this.queue.set(client_exp, [this.clients[index]]);

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
			await game.setWinningScore(body.winning_score);
			await game.setBallSpeed(body.ball_speed);
			await game.addPlayer({ user: this.clients[index].user, client: client });
			await game.addPlayer({ user: this.clients[opponentIndex].user,
				client: this.clients[opponentIndex].client });
			this.games.push(game);
			client.emit('waitingForOpponent');
		}
	}

	@SubscribeMessage('respondToInvite')
	async respondToInvite(@ConnectedSocket() client: Socket)
	{
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		let gameIndex: number = this.games.findIndex(async game => {
			await game.getPlayer1Id() == this.clients[index].user.id && await game.started()
			|| await game.getPlayer2Id() == this.clients[index].user.id && await game.started()
		});

		if (gameIndex !== -1)
			throw new WsException('You are already in a game');

		gameIndex = this.games.findIndex(async game => {
			await game.getPlayer1Id() == this.clients[index].user.id
			|| await game.getPlayer2Id() == this.clients[index].user.id
		});

		if (gameIndex === -1)
			throw new WsException('You have not been invited in a game');

		const game = this.games[gameIndex];
		game.addPlayer({ user: this.clients[index].user, client: client });
		const clientUser: User = await game.getUser1();
		const opponentUser: User = await game.getUser2();
		await game.run();
		this.games.splice(gameIndex, 1);
		const score: { player1: number, player2: number } = await game.getScore(1);
		const winner: User = score.player1 === game.score.winning_score ? clientUser : opponentUser;
		const createMatchDto: CreateMatchDto = {
			user1: clientUser,
			user2: opponentUser,
			score_user1: score.player1,
			score_user2: score.player2,
			winner: winner,
			played_at: new Date(),
			game_type: 'Quick play',
		};
		const match = await this.matchesService.createMatch(createMatchDto);
		this.matchesService.calculateRank(match.id);
	}
}
