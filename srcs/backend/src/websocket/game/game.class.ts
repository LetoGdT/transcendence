import { Ball } from './ball.class';
import { Paddle } from './paddle.class';
import { Score } from './score.class';
import { User } from '../../typeorm/user.entity';
import { Vector2D } from '../../interfaces/object2D.interface';
import { Socket } from 'socket.io';

interface Player
{
	paddle?: Paddle;
	user: User;
	client: Socket;
}

export class Game
{
	private ball: Ball;
	private ball_speed: number = 10;
	private score: Score = new Score();
	private player1: Player;
	private player2: Player;
	private winner: number | null = null ;
	private referencePaddle: Paddle = new Paddle();
	readonly type: 'Ranked' | 'Quick play';
	private readonly refresh_rate: number;
	private start: boolean = false;
	// private games: 

	constructor(refresh_rate: number, type: 'Ranked' | 'Quick play')
	{
		this.refresh_rate = refresh_rate;
		this.type = type;
	}

	async getPlayer1Socket()
	{
		return this.player1?.client;
	}

	async getPlayer1Id()
	{
		return this.player1?.user?.id;
	}

	async getPlayer2Id()
	{
		return this.player2?.user?.id;
	}

	async getPlayer2Socket()
	{
		return this.player2?.client;
	}

	async setWinningScore(winning_score: number): Promise<number>
	{
		try
		{
			this.score = new Score(winning_score);
			return 0;
		}

		catch (err)
		{
			this.score = new Score(5);
			return -1;
		}
	}

	async setPaddleProperties(speed: number, height: number, width: number)
	{
		this.referencePaddle = new Paddle(this.refresh_rate, speed, height, width);
	}

	async setBallSpeed(speed: number)
	{
		if (speed != null)
			this.ball_speed = speed;
	}

	async addPlayer(player: Player): Promise<void>
	{
		if (this.player1 == null)
			this.player1 = { ...player, paddle: new Paddle() };

		else if (this.player2 == null)
			this.player2 = { ...player, paddle: new Paddle() };

		else
			throw new Error("Both players are already set.");
	}

	async player1Up(): Promise<void>
	{
		await this.player1.paddle.moveUp();
	}

	async player2Up(): Promise<void>
	{
		await this.player2.paddle.moveUp();
	}

	async player1Down(): Promise<void>
	{
		await this.player1.paddle.moveDown();
	}

	async player2Down(): Promise<void>
	{
		await this.player2.paddle.moveDown();
	}

	async getBall(player: number): Promise<{ coordinates: Vector2D, speed: number, direction: Vector2D }>
	{
		const ball = await this.ball.getCoordinates();
		if (player === 2)
		{
			ball.coordinates = await this.mirror(ball.coordinates);
			ball.direction.x *= -1;
		}
		return ball;
	}

	async getPlayers(player: number): Promise<{ player1: Vector2D, player2: Vector2D }>
	{
		const player1: Vector2D = { x: this.player1.paddle.coordinates.x,
			y: this.player1.paddle.coordinates.y};
		const player2: Vector2D = { x: this.player2.paddle.coordinates.x,
			y: this.player2.paddle.coordinates.y};
		if (player === 1) 
			return { player1: player1, player2: player2 };
		return { player1: await this.mirror(player2),
			player2: await this.mirror(player1) };
	}

	async getScore(player: number): Promise<{ player1: number, player2: number }>
	{
		if (player === 1)
			return { player1: await this.score.getPlayer1(), player2: await this.score.getPlayer2() };
		return { player1: await this.score.getPlayer2(), player2: await this.score.getPlayer1() };
	}

	async started(): Promise<boolean>
	{
		return this.start;
	}

	async update()
	{
		await this.ball.updateCoordinates();
		this.winner = await this.score.winner();
	}

	async mirror(coordinates: Vector2D)
	{
		coordinates.x = (coordinates.x - 520) * -1 + 520;
		return coordinates;
	}

	async run()
	{
		if (!this.player1 || !this.player2)
			throw new Error("You need 2 players to start a game");
		this.ball = new Ball(this.player1.paddle, this.player2.paddle, this.score,
			this.refresh_rate, this.ball_speed);

		await this.player1.paddle.setX(10);
		await this.player2.paddle.setX(1030 - 13);

		this.start = true;
		this.player1.client.emit('start');
		this.player2.client.emit('start');
		this.player1.client.emit('ball', await this.getBall(1));
		this.player1.client.emit('players', await this.getPlayers(1));
		this.player1.client.emit('score', await this.getScore(1));
		this.player2.client.emit('ball', await this.getBall(2));
		this.player2.client.emit('players', await this.getPlayers(2));
		this.player2.client.emit('score', await this.getScore(2));
		while (true)
		{
			await this.update();
			if (this.winner !== null)
				break;
			this.player1.client.emit('ball', await this.getBall(1));
			this.player1.client.emit('players', await this.getPlayers(1));
			this.player1.client.emit('score', await this.getScore(1));
			this.player2.client.emit('ball', await this.getBall(2));
			this.player2.client.emit('players', await this.getPlayers(2));
			this.player2.client.emit('score', await this.getScore(2));
			await new Promise(r => setTimeout(r, 1000 / (this.refresh_rate * 2)));
		}

		this.player1.client.emit('winner', { score: await this.getScore(1) });
		this.player2.client.emit('winner', { score: await this.getScore(2) });
	}
}