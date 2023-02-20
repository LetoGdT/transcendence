import {WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		MessageBody,
		WebSocketServer,
		ConnectedSocket,
		WsException
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
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
import { PageOptionsDto, Order } from "../dto/page-options.dto";
import { MatchesQueryFilterDto } from '../dto/query-filters.dto';

/* Sync with frontend's code */
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 13;

class RemotePlayer {
	socket: Socket | null;
	user: User;
	score: number;
	y: number;
	private readonly logger = new Logger(RemotePlayer.name);

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

type UpdateMatchHistory = (game: Game, usersService: UsersService) => void;

class Game {
	public startTime: number;
	public player1: RemotePlayer;
	public player2: RemotePlayer;

	private winningUser?: User;

	private maxScore: number; // TODO link it to customization slider (between 5 and 20)

	private gameState: GameState;

	private ballX: number = 0;
	private ballY: number = 0;

	private ballDirX: number = 0;
	private ballDirY: number = 0;

	private ballInitialSpeed: number;
	private ballAcceleration: number = 0.03;
	private ballSpeed: number;
	private ballRadius: number = 5;

	public privateGame: boolean;

	/* Do a short pause after a player scored */
	private scoredTimer: number = 0;

	private readonly spectators: Socket[] = [];

	public updateMatchHistory: UpdateMatchHistory;

	readonly id: number;

	readonly usersService: UsersService;

	private readonly logger = new Logger(Game.name);

	constructor(player1: RemotePlayer, player2: RemotePlayer, updateMatchHistory: UpdateMatchHistory,
		id: number, privateGame: boolean, usersService: UsersService, speed?: number, maxScore?: number) {
		this.startTime = Date.now();

		this.privateGame = privateGame;

		this.player1 = player1;
		this.player2 = player2;

		this.maxScore = 5;
		if (maxScore != null && maxScore >= 5 && maxScore <= 20)
			this.maxScore = maxScore;
		this.ballInitialSpeed = 10;
		if (speed != null && speed >= 5 && speed <= 20)
			this.ballInitialSpeed = speed;

		this.gameState = GameState.Waiting;
		if (!privateGame) {
			this.start();
		}

		this.updateMatchHistory = updateMatchHistory;
		this.id = id;
		this.usersService = usersService;
		this.usersService.changeUserStatus(this.player1.user.id, 'in-game');
		this.usersService.changeUserStatus(this.player2.user.id, 'in-game');
	}

	setInitialSpeed(speed: number)
	{
			this.ballInitialSpeed = speed;
	}

	getState()
	{
		return this.gameState;
	}

	start()
	{
		this.startTime = Date.now();
		this.gameState = GameState.Created;
	}

	resetBall() {
		this.ballDirY = (Math.random() * 2 - 1) / 2;
		this.ballDirX = Math.sqrt(1 - (this.ballDirY * this.ballDirY));

		if (Math.random() < 0.5)
			this.ballDirX *= -1;

		if (Math.random() < 0.5)
			this.ballDirY *= -1;

		this.ballX = GAME_WIDTH / 2;
		this.ballY = GAME_HEIGHT / 2;
		this.ballSpeed = this.ballInitialSpeed;
	}

	tick() {
		if (this.gameState === GameState.Waiting) {
			/* Start the game if both players are connected */
			if (this.player1.socket != null && this.player2.socket != null) {
				this.start();
			}
		} else if (this.gameState === GameState.Created) {
			// this.logger.debug('Game is starting');
			if (null != this.player1.socket) {
				this.netSendGameFoundPacket(this.player1.socket);
				// this.logger.debug('Packet sent');
			}
			if (null != this.player2.socket) {
				this.netSendGameFoundPacket(this.player2.socket);
				// this.logger.debug('Packet sent');
			}
			// this.logger.debug('Switching to countdown state');
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

		let wonPlayerIndex = 0;

		if (this.player1.score === this.maxScore) {
			this.winningUser = this.player1.user;
			this.player1.emit('win', { didWin: true });
			this.player2.emit('win', { didWin: false });
			this.gameState = GameState.Ended;
			wonPlayerIndex = 1;
		} else if (this.player2.score === this.maxScore) {
			this.winningUser = this.player2.user;
			this.player1.emit('win', { didWin: false });
			this.player2.emit('win', { didWin: true });
			this.gameState = GameState.Ended;
			wonPlayerIndex = 2;
		}

		for (const spec of this.spectators) {
			spec.emit('spectator-game-result', { id: wonPlayerIndex });
		}
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
		return this.winningUser;
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
		this.logger.debug(`Reconnecting ${user.username}`);
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
			/* The connecting user is neither player 1 or player 2 so we assume he tried to connect to a private game */
			throw new WsException('This game is private');
		}

		if (GameState.Waiting !== this.gameState) {
			this.netSendGameFoundPacket(socket);
			if (this.gameState === GameState.Playing) {
				player.emit('state', this.createStateUpdatePacket(playerIndex, true));
				socket.emit('start');
				this.sendScoreUpdatePacket();
			}
		} else {
			let username = 'the opponent';

			if (user.id === this.player1.user.id) {
				username = this.player2.user.username;
			} else if (user.id === this.player2.user.id) {
				username = this.player1.user.username;
			}
			socket.emit('waitingForOpponent', { username });
		}
	}

	netSendGameFoundPacket(socket: Socket) {
		const { user: p1 } = this.player1;
		const { user: p2 } = this.player2;
		
		const p1Data = {
			id: p1.id,
			image_url: p1.image_url,
			username: p1.username,
		};

		const p2Data = {
			id: p2.id,
			image_url: p2.image_url,
			username: p2.username,
		};

		if (socket.id === this.player2.socket?.id) {
			socket.emit('gameFound', {
				countdown: Math.min(4000, this.timeSinceStart()),
				player1: p2Data,
				player2: p1Data,
			});
		} else {
			socket.emit('gameFound', {
				countdown: Math.min(4000, this.timeSinceStart()),
				player1: p1Data,
				player2: p2Data,
			});
		}
	}

	getGameState() {
		return this.gameState;
	}
}

class GameManager {
	private games: Game[];
	private id: number = 1;
	private readonly logger = new Logger(GameManager.name);

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
				this.games[j].updateMatchHistory(this.games[j], this.games[j].usersService);
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

	startGame(player1: Connection, player2: Connection, privateGame: boolean, updateMatchHistory: UpdateMatchHistory,
		usersService: UsersService, speed?: number, score?: number) {
		const p1 = new RemotePlayer(player1.client, player1.user);
		const p2 = new RemotePlayer(player2.client, player2.user);

		/* Quick and dirty fix the prevent the game from starting if the players aren't both connected */
		if (privateGame) {
			p2.socket = null;
		}

		const game = new Game(p1, p2, updateMatchHistory, this.id, privateGame, usersService, speed, score);

		this.id++;

		this.games.push(game);

		this.logger.debug(`[GameManager] Creating new ${privateGame ? 'private' : 'public'} game with ${player1.user.username} and ${player2.user.username}`);

		

		return game;
	}

	findGameByUser(user: User) {
		return this.games.find(game => game.hasUser(user));
	}

	getCurrentGameForUser(user: User) {
		return this.games.find(game =>
			game.hasUser(user) && (game.getGameState() === GameState.Playing || game.getGameState() === GameState.Created)
		);
	}

	netPlayerMove(user: User, y: number) {
		const game = this.getCurrentGameForUser(user);

		if (null != game) {
			game.netPlayerMove(user, y);
		}
	}

	handleDisconnect({ user, client }: Connection) {
		for (const game of this.games) {
			if (game.hasUser(user)) {
				game.handleDisconnect(user);
			}
			game.removeSpectator(client);
		}
	}
}

const gameManager = new GameManager();

setInterval(() => {
	gameManager.tick();
}, 20);

@WebSocketGateway({ cors: true })
export class MySocketGateway implements OnGatewayConnection, 
										OnGatewayDisconnect {

	private readonly logger = new Logger(MySocketGateway.name);

	constructor(private readonly auth: AuthService,
				private readonly chat: ChatService,
				private readonly usersService: UsersService,
				private readonly matchesService: MatchesService,
			   	private clients: Connection[]) {}

	@WebSocketServer()
	server: Server;

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
		if (user == null || (user.enabled2fa && this.auth.tokenInfos(cookies.access_token).enabled2fa))
		{
			client.disconnect();
			return ;
		}

		this.clients.push({user, client});
		await this.usersService.changeUserStatus(user.id, 'online');
		this.logger.debug(user.username + " has connected to the websocket");
	}

	removeClientFromQueue(client: Connection) {
		const queueIdx = this.matchmakingQueue.findIndex(e => e.client.id === client.client.id);
		if (queueIdx >= 0) {
			this.matchmakingQueue.splice(queueIdx, 1);
		}
	}

	async handleDisconnect(client: Socket) {
		const index = this.clients.findIndex(element => element.client.id == client.id);

		if (index != -1) {
			const conn = this.clients[index];
			const { user } = conn;

			this.logger.debug(user.username + " has disconnected from the websocket.");
			
			this.removeClientFromQueue(conn);

			gameManager.handleDisconnect(conn);
			await this.usersService.changeUserStatus(user.id, 'offline');
			this.clients.splice(index, 1);
		}
	}

	@SubscribeMessage('gameLeft')
	handleGameLeft(@ConnectedSocket() client: Socket) {
		const connection = this.clients.find(c => c.client.id === client.id);

		if (connection != null)
			this.removeClientFromQueue(connection);

		this.logger.debug(`${connection.user.username} left the queue`);
	}

	@SubscribeMessage('newMessage')
	async onNewMessage(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
		let {users, latest_sent} = await this.chat.onNewMessage(body.chanOrConv, body.isChannel, parse(client.handshake.headers.cookie).access_token);
		let convId: number = body.chanOrConv;
		for (var user of users) {
			for (var connection of this.clients) {
				if (user === connection.user.id) {
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

	@SubscribeMessage('newChannel')
	async onNewChannel() {
		for (var connection of this.clients)
			connection.client.emit("newChannel");
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

	@SubscribeMessage('getInfos')
	async getInfos(@ConnectedSocket() client: Socket)
	{
		const connection = this.clients.find(c => c.client.id == client.id);

		if (connection == null)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const queueIndex = this.matchmakingQueue.findIndex(e => e.user.id === connection.user.id)

		if (queueIndex != -1)
		{
			client.emit('queuing');
			return;
		}

		const game = gameManager.findGameByUser(connection.user);
		if (game != null)
		{
			game.reconnectUser(connection.user, connection.client);
			return;
		}

		const pageOptionsDto = new PageOptionsDto();
		pageOptionsDto.take = 1;
		pageOptionsDto.order = Order.DESC;
		const games = await this.matchesService.getAllMatches(pageOptionsDto, new MatchesQueryFilterDto, connection.user.id);
		const lastGame = games.data[0];

		if (lastGame.user1.id == connection.user.id)
		{
			client.emit('gameFound', {
				countdown: 4000,
				player1: { id: lastGame.user1.id, image_url: lastGame.user1.image_url, username: lastGame.user1.username },
				player2: { id: lastGame.user2.id, image_url: lastGame.user2.image_url, username: lastGame.user2.username },
			});
			client.emit('start');
			client.emit('score', { score1: lastGame.score_user1, score2: lastGame.score_user2 });
			if (lastGame.winner.id == connection.user.id)
				client.emit('win', { didWin: true });
			else
				client.emit('win', { didWin: false });
		}
		else
		{
			client.emit('gameFound', {
				countdown: 4000,
				player2: { id: lastGame.user1.id, image_url: lastGame.user1.image_url, username: lastGame.user1.username },
				player1: { id: lastGame.user2.id, image_url: lastGame.user2.image_url, username: lastGame.user2.username },
			});
			client.emit('start');
			client.emit('score', { score2: lastGame.score_user1, score1: lastGame.score_user2 });
			if (lastGame.winner.id == connection.user.id)
				client.emit('win', { didWin: true });
			else
				client.emit('win', { didWin: false });
		}
	}

	@SubscribeMessage('spectate')
	async spectate(@ConnectedSocket() client: Socket, @MessageBody() body: {
			game_id: number,
		})
	{
		const connection = this.clients.find(c => c.client.id == client.id);

		if (null != connection) {
			const game = gameManager.getGameById(body.game_id);
			
			if (null == game) {
				throw new WsException("The game doesn't exist");
			}

			/* Prevent duplicated packets */
			for (const game of gameManager.getGames()) {
				game.removeSpectator(connection.client);
			}

			game.addSpectator(connection.client);
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
		const remoteConn = this.clients.find(connection => connection.client.id == client.id);
		if (remoteConn == null)
			throw new WsException('We don\'t know you sir, but that\'s our bad (failed to queue)');

		const game = gameManager.getCurrentGameForUser(remoteConn.user);

		if (game != null) {
			game.reconnectUser(remoteConn.user, remoteConn.client);
			this.logger.debug(`Reconnected ${remoteConn.user.username} on socket ${remoteConn.client.id}`);
			return ;
		}

		if (body.type === 'Ranked')
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

				gameManager.startGame(p1, p2, false, async (game: Game, usersService: UsersService) => {
					const createMatchDto: CreateMatchDto = {
						user1: game.player1.user,
						user2: game.player2.user,
						score_user1: game.player1.score,
						score_user2: game.player2.score,
						winner: game.getWinningUser(),
						played_at: new Date(game.startTime),
						game_type: 'Ranked',
					};
					usersService.changeUserStatus(game.player1.user.id, 'online');
					usersService.changeUserStatus(game.player2.user.id, 'online');
					const match = await this.matchesService.createMatch(createMatchDto);
					this.matchesService.calculateRank(match.id);
				}, this.usersService);
			} else {
				this.logger.debug(`${remoteConn.user.username} is queuing`);
				client.emit('queuing');
			}
		}
		else
		{
			if (body.opponent_id == null)
				throw new WsException('You must provide an opponent');

			if (body.opponent_id == remoteConn.user.id)
				throw new WsException('You can\'t play against yourself !');

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

			// 	/* TODO duplicate condition here */
			// TODO restore this condition later
			// if (gameManager.findGameByUser(this.clients[meIndex].user) != null
			// 	|| gameManager.findGameByUser(this.clients[meIndex].user) != null)
			// 	throw new WsException('You or your opponent have already been invited');

			const game = gameManager.startGame(this.clients[meIndex], this.clients[opponentIndex], true,
				async (game: Game, usersService: UsersService) => {
				const createMatchDto: CreateMatchDto = {
					user1: game.player1.user,
					user2: game.player2.user,
					score_user1: game.player1.score,
					score_user2: game.player2.score,
					winner: game.getWinningUser(),
					played_at: new Date(game.startTime),
					game_type: 'Quick play',
				};
				usersService.changeUserStatus(game.player1.user.id, 'online');
				usersService.changeUserStatus(game.player2.user.id, 'online');
				const match = await this.matchesService.createMatch(createMatchDto);
			}, this.usersService, body.ball_speed, body.winning_score);
			this.clients[meIndex].client.emit('gameCreated', { game_id: game.id });
			this.logger.debug(`${this.clients[meIndex]} asked ${this.clients[opponentIndex]} for a private game`);
			this.sendInvitesList(this.clients[opponentIndex]);

			/* Broadcast the notification to every socket this user has */
			for (const { user, client } of this.clients) {
				if (user.id === this.clients[opponentIndex].user.id) {
					client.emit('newGame');
				}
			}
		}
	}

	@SubscribeMessage('getInvites')
	async getInvite(@ConnectedSocket() client: Socket)
	{
		const connection = this.clients.find(connection => connection.client.id == client.id);
		if (connection == null)
			throw new WsException('We don\'t know you sir, but that\'s our bad');
		this.sendInvitesList(connection);
	}

	@SubscribeMessage('join')
	handleJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { game_id: number }) {
		const connection = this.clients.find(e => e.client.id === client.id);

		if (null != connection) {
			let game = gameManager.getCurrentGameForUser(connection.user);

			if (null != game && !game.privateGame) {
				throw new WsException('You are already in a public game');
			}

			game = gameManager.getGameById(body.game_id);
			if (null != game) {
				game.reconnectUser(connection.user, connection.client);
				this.logger.debug(`${connection.user.username} joined a private game`)
			} else {
				throw new WsException('Game not found');
			}
		}
	}

	@SubscribeMessage('refuseInvite')
	async respondToInvite(@ConnectedSocket() client: Socket, @MessageBody() body: { game_id: number })
	{
		const connection = this.clients.find(c => c.client.id == client.id);
		if (null == connection)
			throw new WsException('We don\'t know you sir, but that\'s our bad');

		const game = gameManager.getGameById(body.game_id);
		if (null != game && game.hasUser(connection.user)) {
			gameManager.cancelGame(game.id);
		}
		game.player1.socket.emit('refuseInvite');
		this.sendInvitesList(connection);
		this.logger.debug(`${connection.user.username} refused the invitation to a game`);
	}

	sendInvitesList({ user, client }: Connection) {
		const invites = [];

		for (const game of gameManager.getGames()) {
			if (game.hasUser(user) && game.getGameState() === GameState.Waiting && game.privateGame) {
				const player1 = game.player1.user;
				const player2 = game.player2.user;
				const senderUser = player1.id === user.id ? player2 : player1;

				invites.push({
					game_id: game.id,
					user: senderUser,
				});
			}
		}
		client.emit('returnInvites', invites);
	}
}
