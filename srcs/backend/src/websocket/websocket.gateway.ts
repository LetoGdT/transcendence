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
// import { Game } from './game/game.class';
import { CreateMatchDto } from '../dto/matches.dto';

class RemotePlayer {
	socket: Socket | null;
	user: User;
	score: number;
	y: number;

	constructor(socket: Socket, user: User) {
		this.socket = socket;
		this.user = user;
		this.score = 0;
		this.y = 0;
	}

	emit(ev: string, ...args: any[]) {
		if (this.socket !== null) {
			this.socket.emit(ev, ...args);
		}
	}
}


enum GameState {
	Created,
	Countdown,
	Playing,
	Ended,
}

interface NetworkedGameState {
	p1_y: number;
	p2_y: number;
	ball_x: number;
	ball_y: number;
	ball_dx: number;
	ball_dy: number;
	authoritative: boolean;
}

class Game {
	private startTime: number;
	private player1: RemotePlayer;
	private player2: RemotePlayer;

	private maxScore: number;

	private gameState: GameState;

	constructor(player1: RemotePlayer, player2: RemotePlayer) {
		this.startTime = Date.now();

		this.player1 = player1;
		this.player2 = player2;

		this.maxScore = 5;

		this.gameState = GameState.Created;
	}

	tick() {
		if (this.gameState === GameState.Created) {
			this.player1.emit('gameFound', { countdown: 3 });
			this.player2.emit('gameFound', { countdown: 3 });
			this.gameState = GameState.Countdown;
		} else if (this.gameState === GameState.Countdown) {
			if (this.timeSinceStart() >= 4000) {
				this.gameState = GameState.Playing;

				this.player1.emit('start');
				this.player2.emit('start');
			}
		} else if (this.gameState === GameState.Playing) {
			this.sendStateUpdatePacket(1, this.player1); /* Send for player 1 */
			this.sendStateUpdatePacket(2, this.player2); /* Send for player 2 */

			/* End the game if it is taking too long */
			if (this.getWinningUser() !== null || this.timeSinceStart() >= 60000) {
				this.gameState = GameState.Ended;
			}
		}
	}

	sendStateUpdatePacket(playerIndex: number, player: RemotePlayer) {
		const state: NetworkedGameState = {
			p1_y: 0,
			p2_y: 0,
			ball_x: 40,
			ball_y: 0,
			ball_dx: 0,
			ball_dy: 0,
			authoritative: false,
		};

		if (1 === playerIndex) {
			state.p1_y = this.player1.y;
			state.p2_y = this.player2.y;
		} else if (2 === playerIndex) {
			state.p1_y = this.player2.y;
			state.p2_y = this.player1.y;
		}

		player.emit('state', state);
	}

	netPlayerMove(user: User, y: number) {
		if (this.player1.user.id === user.id) {
			this.player1.y = y;
		} else if (this.player2.user.id === user.id) {
			this.player2.y = y;
		} else {
			throw new WsException('wtf is going on');
		}
	}

	getWinningUser(): User | null {
		if (this.player1.score >= this.maxScore) {
			return this.player1.user;
		} else if (this.player2.score >= this.maxScore) {
			return this.player2.user;
		}
		return null;
	}

	timeSinceStart() {
		return Date.now() - this.startTime;
	}

	hasEnded() {
		return this.gameState === GameState.Ended;
	}

	hasUser(user: User) {
		return (user.id === this.player1.user.id || user.id === this.player2.user.id);
	}
}

class GameManager {
	private games: Game[];

	constructor() {
		this.games = [];
	}

	updateMatchHistory(game: Game) {
		console.log('updateMatchHistory() with game = ');
	}

	removeFinishedGames() {
		let i, j;
		
		for (i = 0, j = 0; i < this.games.length; ++i) {
			if (this.games[j].hasEnded()) {
				this.updateMatchHistory(this.games[j]);
				this.games.splice(j, 1);
			} else {
				++j;
			}
		}
	}

	tick() {
		let i;

		this.removeFinishedGames();
		
		/* Tick all games */
		for (i = 0; i < this.games.length; ++i) {
			this.games[i].tick();
		}
	}

	startGame(player1: Connection, player2: Connection) {
		const p1 = new RemotePlayer(player1.client, player1.user);
		const p2 = new RemotePlayer(player2.client, player2.user);
		const game = new Game(p1, p2);

		this.games.push(game);

		console.log(`New game started (total ${this.games.length})`);

		// const game = new Game(50, 'Ranked');

		// game.addPlayer({ user: client.user, client: client.client });
		// game.addPlayer({ user: opponent.user, client: opponent.client });
		// client.client.emit('gameFound');
		// opponent.client.emit('gameFound');
		// games.push(game);
		// await game.run();
		// const gameIndex: number = games.findIndex(async game => {
		// 	(await game.getPlayer1Id()) == client.user.id
		// 	&& (await game.getPlayer2Id()) == opponent.user.id
		// });
		// games.splice(gameIndex, 1);
		// const score: { player1: number, player2: number } = await game.getScore(1);
		// const winner: User = score.player1 === 5 ? client.user : opponent.user;
		// const createMatchDto: CreateMatchDto = {
		// 	user1: client.user,
		// 	user2: opponent.user,
		// 	score_user1: score.player1,
		// 	score_user2: score.player2,
		// 	winner: winner,
		// 	played_at: new Date(),
		// 	game_type: 'Ranked',
		// };
		// const match = await this.matchesService.createMatch(createMatchDto);
		// this.matchesService.calculateRank(match.id);
	}

	findGameByUser(user: User) {
		return this.games.find(game => game.hasUser(user));
	}

	netPlayerMove(user: User, y: number) {
		const game = this.findGameByUser(user);

		if (undefined !== game) {
			game.netPlayerMove(user, y);
		} else {
			throw new WsException('Player has no game');
		}
	}
}

const gameManager = new GameManager();

setInterval(() => {
	gameManager.tick();
}, 20);

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

	matchmakingQueue: Connection[] = [];

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
		const index = this.clients.findIndex(element => element.client.id == client.id);

		if (index != -1) {
			const user = this.clients[index].user;
			//const connections = this.queue.get(user.exp);

			console.log(user.username + " has disconnected from the websocket.");
			
		/*	if (connections)
			{
				const conn_idx = connections.findIndex(conn => conn.user.id === user.id);
				if (conn_idx != -1)
					connections.splice(conn_idx, 1);
			}*/

			const queueIdx = this.matchmakingQueue.findIndex(e => e.client.id === client.id);
			if (queueIdx >= 0) {
				this.matchmakingQueue.splice(queueIdx, 1);
			}
			await this.usersService.changeUserStatus(this.clients[index].user.id, 'offline');
			for (let game of this.games)
				game.removeSpectator(this.clients[index]);
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

	@SubscribeMessage('newGame')
	async onNewGame(@MessageBody() body: any) {
		for (var connection of this.clients) {
			if (connection.user.id === body?.id) {
				connection.client.emit("newGame");
				continue ;
			}
		}
	}

	@SubscribeMessage('spectate')
	async spectate(@ConnectedSocket() client: Socket, @MessageBody() body: {
			player1_id: number,
			player2_id: number,
		})
	{
		for (let game of gameManager.games)
		{
			if ((await game.getPlayer1Id() == body.player1_id
							&& await game.getPlayer2Id() == body.player2_id
							&& await game.started())
					|| (await game.getPlayer2Id() == body.player1_id
							&& await game.getPlayer1Id() == body.player2_id
							&& await game.started()))
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
		// if (this.games == null)
		// 	throw new WsException('No game created');

		// const index: number = this.games.findIndex(async game => (await game.getPlayer1Socket()).id == client.id
		// 	|| (await game.getPlayer2Socket()).id == client.id);

		// if (index === -1)
		// 	throw new WsException('You are not in a game');

		// const game = this.games[index];

		// if ((await game.getPlayer1Socket()).id == client.id)
		// 	await game.player1Up();
		// else
		// 	await game.player2Up();
	}

	@SubscribeMessage('moveDown')
	async moveDown(@ConnectedSocket() client: Socket,)
	{
		// if (this.games == null)
		// 	throw new WsException('No game created');

		// const index: number = this.games.findIndex(async game => (await game.getPlayer1Socket()).id == client.id
		// 	|| (await game.getPlayer2Socket()).id == client.id);

		// if (index === -1)
		// 	throw new WsException('You are not in a game');

		// const game = this.games[index];

		// if ((await game.getPlayer1Socket()).id == client.id)
		// 	await game.player1Down();
		// else
		// 	await game.player2Down();
	}

	@SubscribeMessage('move')
	playerMove(@MessageBody() body: {
		y: number,
	}, @ConnectedSocket() client: Socket) {

		const idx = this.clients.findIndex(e => e.client.id === client.id);

		if (idx < 0)
			return ;
		
		const conn = this.clients[idx];
		
		gameManager.netPlayerMove(conn.user, body.y);
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
		
		const remoteConn = this.clients[index];

		/*
		const gameIndex: number = this.games.findIndex(async game => {
			await game.getPlayer1Id() == body.opponent_id && await game.started()
			|| await game.getPlayer1Id() == remoteConn.user.id && await game.started()
			|| await game.getPlayer2Id() == body.opponent_id && await game.started()
			|| await game.getPlayer2Id() == remoteConn.user.id && await game.started()
		});

		if (gameIndex !== -1)
		{
			const game = this.games[gameIndex];
			if (await game.getPlayer1Id() == remoteConn.user.id)
				game.setPlayer1Socket(client);
			else
				game.setPlayer2Socket(client);
			client.emit('gameFound');
		}*/

		if (body.type == 'Ranked')
		{
			const queueIdx = this.matchmakingQueue.findIndex(e => e.user.id === remoteConn.user.id);

			/* Is already in a queue ? */
			if (queueIdx >= 0) {
				return ;
			}

			this.matchmakingQueue.push(remoteConn);

			if (this.matchmakingQueue.length >= 2) {
				const p1 = this.matchmakingQueue.pop();
				const p2 = this.matchmakingQueue.pop();

				gameManager.startGame(p1, p2);
			} else {
				client.emit('queuing');
			}

		/*	const client_exp = remoteConn.user.exp;

			for (let connections of this.queue.values())
			{
				for (let connection of connections)
				{
					if (connection.user.id == remoteConn.user.id)
					{
						throw new WsException('You are already in queue');
					}
				}
			}

			const opponent: Connection | null = this.chat.searchOpponent(this.queue, client_exp,
				remoteConn.user.id);
			if (opponent != null)
			{
				await this.chat.startGame(remoteConn, opponent, this.games);
				return ;
			}
			if (this.queue.get(client_exp) != null)
				this.queue.get(client_exp).push(remoteConn);
			else
				this.queue.set(client_exp, [remoteConn]);*/
		}
		else
		{
			// if (body.opponent_id == null)
			// 	throw new WsException('You must provide an opponent');

			// const opponentIndex: number = this.clients.findIndex(connection => {
			// 	connection.client.id == client.id
			// });

			// if (opponentIndex === -1)
			// 	throw new WsException('Opponent not connected');

			// const game = new Game(50, 'Quick play');
			// await game.setWinningScore(body.winning_score);
			// await game.setBallSpeed(body.ball_speed);
			// await game.addPlayer({ user: remoteConn.user, client: client });
			// await game.addPlayer({ user: this.clients[opponentIndex].user,
			// 	client: this.clients[opponentIndex].client });
			// this.games.push(game);
			// client.emit('waitingForOpponent');
		}
	}

	@SubscribeMessage('respondToInvite')
	async respondToInvite(@ConnectedSocket() client: Socket)
	{
		// const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		// if (index === -1)
		// 	throw new WsException('We don\'t know you sir, but that\'s our bad');

		// let gameIndex: number = this.games.findIndex(async game => {
		// 	await game.getPlayer1Id() == this.clients[index].user.id && await game.started()
		// 	|| await game.getPlayer2Id() == this.clients[index].user.id && await game.started()
		// });

		// if (gameIndex !== -1)
		// 	throw new WsException('You are already in a game');

		// gameIndex = this.games.findIndex(async game => {
		// 	await game.getPlayer1Id() == this.clients[index].user.id
		// 	|| await game.getPlayer2Id() == this.clients[index].user.id
		// });

		// if (gameIndex === -1)
		// 	throw new WsException('You have not been invited in a game');

		// const game = this.games[gameIndex];
		// game.addPlayer({ user: this.clients[index].user, client: client });
		// const clientUser: User = await game.getUser1();
		// const opponentUser: User = await game.getUser2();
		// await game.run();
		// this.games.splice(gameIndex, 1);
		// const score: { player1: number, player2: number } = await game.getScore(1);
		// const winner: User = score.player1 === game.score.winning_score ? clientUser : opponentUser;
		// const createMatchDto: CreateMatchDto = {
		// 	user1: clientUser,
		// 	user2: opponentUser,
		// 	score_user1: score.player1,
		// 	score_user2: score.player2,
		// 	winner: winner,
		// 	played_at: new Date(),
		// 	game_type: 'Quick play',
		// };
		// const match = await this.matchesService.createMatch(createMatchDto);
		// this.matchesService.calculateRank(match.id);
	}
}
