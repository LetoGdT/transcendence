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

/* Sync with frontend's code */
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 13;

class RemotePlayer {
	socket: Socket | null;
	user: User;
	score: number;
	y: number;

	constructor(socket: Socket, user: User) {
		this.socket = socket;
		this.user = user;
		this.score = 0;
		this.y = GAME_HEIGHT / 2;
	}

	emit(ev: string, ...args: any[]) {
		if (this.socket !== null) {
			this.socket.emit(ev, ...args);
		}
	}
}


enum GameState {
	Waiting,
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

const GAME_WIDTH = 1040;
const GAME_HEIGHT = 680;

type UpdateMatchHistory = (game: Game) => void;

class Game {
	public startTime: number;
	public player1: RemotePlayer;
	public player2: RemotePlayer;

	private maxScore: number;

	private gameState: GameState;

	private ballX: number = 0;
	private ballY: number = 0;

	private ballDirX: number = 0;
	private ballDirY: number = 0;

	private ballInitialSpeed: number = 10;
	private ballAcceleration: number = 0.03;
	private ballSpeed: number = 0;
	private ballRadius: number = 5;

	/* Do a short pause after a player scored */
	private scoredTimer: number = 0;

	private readonly spectators: Socket[] = [];

	public updateMatchHistory: UpdateMatchHistory;

	readonly id: number;

	constructor(player1: RemotePlayer, player2: RemotePlayer, updateMatchHistory: UpdateMatchHistory, id: number, waiting: boolean) {
		this.startTime = Date.now();

		this.player1 = player1;
		this.player2 = player2;

		this.maxScore = 50; // TODO set it back to 5

		if (waiting)
			this.gameState = GameState.Waiting;
		else
			this.gameState = GameState.Created;

		this.updateMatchHistory = updateMatchHistory;
		this.id = id;
	}

	setInitialSpeed(speed: number)
	{
		if (speed >= 5 && speed <= 20)
			this.ballInitialSpeed = speed;
	}

	setMaxScore(score: number)
	{
		if (score >= 5 && score <= 20)
			this.maxScore = score;
	}

	getState()
	{
		return this.gameState;
	}

	start()
	{
		this.gameState = GameState.Created;
	}

	resetBall() {
		/* Pick a random angle between 0 and 90 degrees */
		let quarterPi;

		if (Math.random() < 0.5)
		{
			quarterPi = Math.PI / 4;
		}
		else
			quarterPi = Math.PI * 3 / 4;
		
		const angle = Math.random() * quarterPi - quarterPi;
		this.ballDirX = Math.cos(angle);
		this.ballDirY = Math.sin(angle);

		if (Math.random() < 0.5)
			this.ballDirX *= -1;

		if (Math.random() < 0.5)
			this.ballDirY *= -1;

		this.ballX = GAME_WIDTH / 2;
		this.ballY = GAME_HEIGHT / 2;
		this.ballSpeed = this.ballInitialSpeed;
	}

	tick() {
		if (this.gameState === GameState.Created) {
			if (null != this.player1.socket) {
				this.netSendGameFoundPacket(this.player1.socket);
			}
			if (null != this.player2.socket) {
				this.netSendGameFoundPacket(this.player2.socket);
			}
			this.gameState = GameState.Countdown;
		} else if (this.gameState === GameState.Countdown) {
			if (this.timeSinceStart() >= 4000) {
				this.gameState = GameState.Playing;

				this.resetBall();

				this.player1.emit('start');
				this.player2.emit('start');
				this.sendScoreUpdatePacket();
			}
		} else if (this.gameState === GameState.Playing) {
			if (this.scoredTimer <= 0) {
				this.updateBallPosition();
			} else {
				--this.scoredTimer;
			}

			this.player1.emit('state', this.createStateUpdatePacket(1, false));
			this.player2.emit('state', this.createStateUpdatePacket(2, false));

			for (const spec of this.spectators) {
				spec.emit('state', this.createStateUpdatePacket(1, true));
			}

			/* End the game if it is taking too long */
			if (this.getWinningUser() !== null) {
				if (this.player1.score === this.maxScore) {
					this.player1.emit('win', { didWin: true });
					this.player2.emit('win', { didWin: false });
				} else if (this.player2.score === this.maxScore) {
					this.player1.emit('win', { didWin: false });
					this.player2.emit('win', { didWin: true });
				}
				this.gameState = GameState.Ended;
			}
		}
	}

	updateBallPosition() {
		this.ballX = this.ballX + this.ballDirX * this.ballSpeed;
		this.ballY = this.ballY + this.ballDirY * this.ballSpeed;

		/* Check if the ball bounces on the up wall and down wall */
		if (this.ballY + this.ballRadius > GAME_HEIGHT || this.ballY - this.ballRadius < 0)
        {
            this.ballDirY *= -1;
        }

		/* Check if the ball collides with the paddles */
		if (this.paddleCollides())
		{
			this.ballDirX *= -1;
			// let impact = this.coordinates.y - this.paddle1.bottom - this.paddle1.height / 2;
			// let ratio = 100 / (this.paddle1.height / 2);
			// this.direction.y = Math.round(impact * ratio);

			if (this.ballSpeed <= 100)
				this.ballSpeed += this.ballSpeed * this.ballAcceleration;
		}
		else {
			if (this.ballX - this.ballRadius <= PLAYER_WIDTH) {
				this.playerScored(2);
			} else if (this.ballX + this.ballRadius >= GAME_WIDTH - PLAYER_WIDTH) {
				this.playerScored(1);
			}
		}
	}

	playerScored(playerIndex: number) {
		this.resetBall();
		
		if (playerIndex === 1) {
			this.player1.score++;
		} else if (playerIndex === 2) {
			this.player2.score++;
		}

		this.sendScoreUpdatePacket();

		this.scoredTimer = 75; /* 1.5s * TPS (50) */
	}

	paddleCollides() {
		const paddle1Top = this.player1.y;
		const paddle1Bottom = paddle1Top + PLAYER_HEIGHT;

		const paddle2Top = this.player2.y;
		const paddle2Bottom = paddle2Top + PLAYER_HEIGHT;

		if ((this.ballX - this.ballRadius <= PLAYER_WIDTH
			&& this.ballY + this.ballRadius >= paddle1Top
			&& this.ballY - this.ballRadius <= paddle1Bottom)
		|| (this.ballX + this.ballRadius >= GAME_WIDTH - PLAYER_WIDTH
			&& this.ballY + this.ballRadius >= paddle2Top
			&& this.ballY - this.ballRadius <= paddle2Bottom)) {
		
			return true;
		}
		return false;
	}

	sendScoreUpdatePacket() {
		const player1Score = {
			score1: this.player1.score,
			score2: this.player2.score,
		};

		this.player1.emit('score', player1Score);

		this.player2.emit('score', {
			score1: this.player2.score,
			score2: this.player1.score,
		});

		for (const socket of this.spectators) {
			socket.emit('score', player1Score);
		}
	}

	createStateUpdatePacket(playerIndex: number, forceUpdate: boolean) : NetworkedGameState {
		const state: NetworkedGameState = {
			p1_y: 0,
			p2_y: 0,
			ball_x: 0,
			ball_y: this.ballY,
			ball_dx: this.ballDirX,
			ball_dy: this.ballDirY,
			authoritative: forceUpdate,
		};

		if (1 === playerIndex) {
			state.p1_y = this.player1.y;
			state.p2_y = this.player2.y;
			state.ball_x = this.ballX;
		} else if (2 === playerIndex) {
			state.p1_y = this.player2.y;
			state.p2_y = this.player1.y;
			state.ball_x = GAME_WIDTH - this.ballX - 1;
		}

		return state;
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

	addSpectator(socket: Socket) {
		const idx = this.spectators.findIndex(e => e.id === socket.id);
		if (idx < 0) {
			this.spectators.push(socket);

			this.netSendGameFoundPacket(socket);
			if (this.gameState === GameState.Playing) {
				socket.emit('start');
				this.sendScoreUpdatePacket();
			}
		}
	}
	
	removeSpectator(socket: Socket) {
		const idx = this.spectators.findIndex(e => e.id === socket.id);

		if (idx >= 0) {
			this.spectators.splice(idx, 1);
		}
	}

	handleDisconnect(user: User) {
		if (user.id === this.player1.user.id) {
			this.player1.socket = null;
		} else if (user.id === this.player2.user.id) {
			this.player2.socket = null;
		}
	}

	reconnectUser(user: User, socket: Socket) {
		let playerIndex: number;
		let player: RemotePlayer;

		if (user.id === this.player1.user.id) {
			playerIndex = 1;
			player = this.player1;
			this.player1.socket = socket;
		} else if (user.id === this.player2.user.id) {
			playerIndex = 2;
			player = this.player2;
			this.player2.socket = socket;
		} else {
			return ;
		}

		this.netSendGameFoundPacket(socket);
		if (this.gameState === GameState.Playing) {
			player.emit('state', this.createStateUpdatePacket(playerIndex, true));
			socket.emit('start');
			this.sendScoreUpdatePacket();
		}
	}

	netSendGameFoundPacket(socket: Socket) {
		socket.emit('gameFound', {
			countdown: Math.min(4000, this.timeSinceStart())
		});
	}
}

class GameManager {
	private games: Game[];
	private id: number = 0;

	constructor() {
		this.games = [];
	}

	getGames(): Game[] {
		return this.games;
	}

	cancelGame(id: number)
	{
		const toRemove = this.games.findIndex((game) => {
			return game.id == id;
		});
		this.games.splice(toRemove, 1);
	}

	getGameById(id: number): Game | undefined {
		return this.games.find(e => e.id === id);
	}

	removeFinishedGames() {
		let i, j;
		
		for (i = 0, j = 0; i < this.games.length; ++i) {
			if (this.games[j].hasEnded()) {
				this.games[j].updateMatchHistory(this.games[j]);
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

	startGame(player1: Connection, player2: Connection, waiting: boolean, updateMatchHistory: UpdateMatchHistory,
		speed?: number, score?: number) {
		const p1 = new RemotePlayer(player1.client, player1.user);
		const p2 = new RemotePlayer(player2.client, player2.user);
		const game = new Game(p1, p2, updateMatchHistory, this.id, waiting);

		this.id++;

		this.games.push(game);

		return game;
	}

	findGameByUser(user: User) {
		return this.games.find(game => game.hasUser(user));
	}

	netPlayerMove(user: User, y: number) {
		const game = this.findGameByUser(user);

		if (undefined !== game) {
			game.netPlayerMove(user, y);
		}
	}

	handleDisconnect({ user, client }: Connection) {
		const game = this.findGameByUser(user);

		if (null != game) {
			game.handleDisconnect(user);
		}

		for (const game of this.games) {
			game.removeSpectator(client);
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
			const conn = this.clients[index];
			const { user } = conn;
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

			gameManager.handleDisconnect(conn);

			await this.usersService.changeUserStatus(user.id, 'offline');
			// TODO spectator mode
			// for (let game of this.games)
			// 	game.removeSpectator(this.clients[index]);
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
			game_id: number,
		})
	{
		const index = this.clients.findIndex(connection => connection.client.id == client.id);

		if (index >= 0) {
			const game = gameManager.getGameById(body.game_id);
			
			if (null == game) {
				throw new WsException("The game doesn't exist");
			}

			game.addSpectator(this.clients[index].client);
		}
	}

	@SubscribeMessage('getGames')
	async getGames(@ConnectedSocket() client: Socket)
	{
		client.emit('returnGames', gameManager.getGames().map(game => ({
			game_id: game.id,
			player1_id: game.player1.user.id,
			player2_id: game.player2.user.id,
			player1_username: game.player1.user.username,
			player2_username: game.player2.user.username,
		})));
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
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad (failed to queue)');
		
		const remoteConn = this.clients[index];

		const game = gameManager.findGameByUser(remoteConn.user);

		if (null != game) {
			game.reconnectUser(remoteConn.user, remoteConn.client);
			return ;
		}

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

				gameManager.startGame(p1, p2, false, async (game: Game) => {
					const createMatchDto: CreateMatchDto = {
						user1: game.player1.user,
						user2: game.player2.user,
						score_user1: game.player1.score,
						score_user2: game.player2.score,
						winner: game.getWinningUser(),
						played_at: new Date(game.startTime),
						game_type: 'Ranked',
					};
					const match = await this.matchesService.createMatch(createMatchDto);
					this.matchesService.calculateRank(match.id);
				});
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
			if (body.opponent_id == null)
				throw new WsException('You must provide an opponent');

			const opponentIndex: number = this.clients.findIndex(connection => {
				return connection.user.id == body.opponent_id
			});

			const meIndex: number = this.clients.findIndex(connection => {
				return connection.client.id == client.id
			});

			if (opponentIndex === -1)
				throw new WsException('Opponent not connected');

			if (meIndex === -1)
				throw new WsException('An unexpected error occured');

			if (gameManager.findGameByUser(this.clients[meIndex].user) != null
				|| gameManager.findGameByUser(this.clients[meIndex].user) != null)
				throw new WsException('You or your opponent have already been invited');

			const game = gameManager.startGame(this.clients[meIndex], this.clients[opponentIndex], true, async (game: Game) => {
					const createMatchDto: CreateMatchDto = {
						user1: game.player1.user,
						user2: game.player2.user,
						score_user1: game.player1.score,
						score_user2: game.player2.score,
						winner: game.getWinningUser(),
						played_at: new Date(game.startTime),
						game_type: 'Quick play',
					};
					const match = await this.matchesService.createMatch(createMatchDto);
					this.matchesService.calculateRank(match.id);
				});

			this.clients[opponentIndex].client.emit('returnInvites', [{
				game_id: game.id,
				user: this.clients[meIndex].user,
			}]);

			// const game = new Game(50, 'Quick play');
			// await game.setWinningScore(body.winning_score);
			// await game.setBallSpeed(body.ball_speed);
			// await game.addPlayer({ user: remoteConn.user, client: client });
			// await game.addPlayer({ user: this.clients[opponentIndex].user,
			// 	client: this.clients[opponentIndex].client });
			// this.games.push(game);
			client.emit('waitingForOpponent');
		}
	}

	@SubscribeMessage('getInvites')
	async getInvite(@ConnectedSocket() client: Socket)
	{
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const game = gameManager.findGameByUser(this.clients[index].user);

		if (game == null)
			return;

		const player1 = game.player1.user;

		const player2 = game.player2.user;

		const senderUser = player1.id === this.clients[index].user.id ? player2 : player1;

		client.emit('returnInvites', [{
			game_id: game.id,
			user: senderUser,
		}]);
	}

	@SubscribeMessage('respondToInvite')
	async respondToInvite(@ConnectedSocket() client: Socket, @MessageBody() body: { id: number | null })
	{
		const index: number = this.clients.findIndex(connection => connection.client.id == client.id);
		if (index === -1)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const game = gameManager.findGameByUser(this.clients[index].user);

		if (game == null)
			throw new WsException('You have not been invited in a game');

		if (body.id === null)
		{
			gameManager.cancelGame(game.id);
			client.emit('returnInvites', []);
			return;
		}

		if (game.getState() !== GameState.Waiting)
			throw new WsException('Game already started');

		game.start();

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
