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
	private score: Score = new Score();
	private player1: Player;
	private player2: Player;
	private winner: number | null = null ;
	private referencePaddle: Paddle = new Paddle();
	private readonly refresh_rate: number;

	constructor(refresh_rate: number)
	{
		this.refresh_rate = refresh_rate;
	}

	setWinningScore(winning_score: number): number
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

	setPaddleProperties(speed: number, height: number, width: number)
	{
		this.referencePaddle = new Paddle(this.refresh_rate, speed, height, width);
	}

	addPlayer(player: Player): void
	{
		if (this.player1 == null)
			this.player1 = { ...player, paddle: structuredClone(this.referencePaddle) };

		else if (this.player2 == null)
			this.player2 = { ...player, paddle: structuredClone(this.referencePaddle) };

		else
			throw new Error("Both players are already set.");
	}

	player1Up(): void
	{
		this.player1.paddle.moveUp();
	}

	player2Up(): void
	{
		this.player2.paddle.moveUp();
	}

	player1Down(): void
	{
		this.player1.paddle.moveDown();
	}

	player2Down(): void
	{
		this.player2.paddle.moveDown();
	}

	getBall(): { coordinates: Vector2D, speed: number, direction: Vector2D }
	{
		this.update();
		return this.ball.getCoordinates();
	}

	getPlayers(): { player1: Vector2D, player2: Vector2D }
	{
		return { player1: this.player1.paddle.coordinates, player2: this.player2.paddle.coordinates };
	}

	getScore(): { player1: number, player2: number }
	{
		this.update();
		return { player1: this.score.getPlayer1(), player2: this.score.getPlayer2() };
	}

	update()
	{
		this.ball.updateCoordinates();
		this.winner = this.score.winner();
	}

	async run()
	{
		if (!this.player1 || !this.player2)
			throw new Error("You need 2 players to start a game");
		this.ball = new Ball(this.player1.paddle, this.player2.paddle, this.score);
		this.player1.client.emit('ball', this.getBall());
		this.player1.client.emit('players', this.getPlayers());
		this.player1.client.emit('score', this.getScore());
		this.player2.client.emit('ball', this.getBall());
		this.player2.client.emit('players', this.getPlayers());
		this.player2.client.emit('score', this.getScore());

		while (true)
		{
			this.update();
			if (this.winner)
				break;
			this.player1.client.emit('ball', this.getBall());
			this.player1.client.emit('players', this.getPlayers());
			this.player1.client.emit('score', this.getScore());
			this.player2.client.emit('ball', this.getBall());
			this.player2.client.emit('players', this.getPlayers());
			this.player2.client.emit('score', this.getScore());
			await new Promise(r => setTimeout(r, 1000 / 50));
		}
	}


}