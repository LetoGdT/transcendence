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
	score: Score = new Score();
	private player1: Player;
	private player2: Player;
	private winner: number | null = null ;
	private referencePaddle: Paddle = new Paddle();
	readonly type: 'Ranked' | 'Quick play';
	private readonly refresh_rate: number;
	private start: boolean = false;

	constructor(refresh_rate: number, type: 'Ranked' | 'Quick play')
	{
		this.refresh_rate = refresh_rate;
		this.type = type;
	}

	getPlayer1Socket()
	{
		return this.player1?.client;
	}

	getPlayer2Socket()
	{
		return this.player2?.client;
	}

	setPlayer1Socket(client: Socket)
	{
		if (this.player1 != null)
			this.player1.client = client;
	}

	setPlayer2Socket(client: Socket)
	{
		if (this.player2 != null)
			this.player2.client = client;
	}

	getPlayer1Id()
	{
		return this.player1?.user?.id;
	}

	getPlayer2Id()
	{
		return this.player2?.user?.id;
	}

	getUser1()
	{
		return this.player1?.user;
	}

	getUser2()
	{
		return this.player2?.user;
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

	setBallSpeed(speed: number)
	{
		if (speed != null)
			this.ball_speed = speed;
	}

	addPlayer(player: Player)
	{
		if (this.player1 == null)
			this.player1 = { ...player, paddle: new Paddle() };

		else if (this.player2 == null)
			this.player2 = { ...player, paddle: new Paddle() };

		else
			throw new Error("Both players are already set.");
	}

	player1Up()
	{
		this.player1.paddle.moveUp();
	}

	player2Up()
	{
		this.player2.paddle.moveUp();
	}

	player1Down()
	{
		this.player1.paddle.moveDown();
	}

	player2Down()
	{
		this.player2.paddle.moveDown();
	}

	getBall(player: number): { coordinates: Vector2D, speed: number, direction: Vector2D }
	{
		const ball = this.ball.getCoordinates();
		if (player === 2)
		{
			ball.coordinates = this.mirror(ball.coordinates);
			ball.direction.x *= -1;
		}
		return ball;
	}

	getPlayers(player: number): { player1: Vector2D, player2: Vector2D }
	{
		const player1: Vector2D = { x: this.player1.paddle.coordinates.x,
			y: this.player1.paddle.coordinates.y};
		const player2: Vector2D = { x: this.player2.paddle.coordinates.x,
			y: this.player2.paddle.coordinates.y};
		if (player === 1) 
			return { player1: player1, player2: player2 };
		const ret2 = this.mirror(player2);
		const ret1 = this.mirror(player1);
		ret2.x -= this.player2.paddle.width;
		ret1.x -= this.player1.paddle.width;
		return { player1: ret2,
			player2: ret1 };
	}

	getScore(player: number): { player1: number, player2: number }
	{
		if (player === 1)
			return { player1: this.score.getPlayer1(), player2: this.score.getPlayer2() };
		return { player1: this.score.getPlayer2(), player2: this.score.getPlayer1() };
	}

	started()
	{
		return this.start;
	}

	update()
	{
		this.ball.updateCoordinates();
		this.winner = this.score.winner();
	}

	mirror(coordinates: Vector2D)
	{
		coordinates.x = (coordinates.x - 520) * -1 + 520;
		return coordinates;
	}

	run()
	{
		if (!this.player1 || !this.player2)
			throw new Error("You need 2 players to start a game");
		this.ball = new Ball(this.player1.paddle, this.player2.paddle, this.score,
			this.refresh_rate, this.ball_speed);

		this.player1.paddle.setX(0);
		this.player2.paddle.setX(1040 - 13);

		this.start = true;
		this.player1.client.emit('start');
		this.player2.client.emit('start');
		this.player1.client.emit('ball', this.getBall(1));
		this.player1.client.emit('players', this.getPlayers(1));
		this.player1.client.emit('score', this.getScore(1));
		this.player2.client.emit('ball', this.getBall(2));
		this.player2.client.emit('players', this.getPlayers(2));
		this.player2.client.emit('score', this.getScore(2));

		const st = () => setTimeout(function() {
			this.update();
			if (this.winner !== null)
			{
				this.player1.client.emit('winner', { score: this.getScore(1) });
				this.player2.client.emit('winner', { score: this.getScore(2) });
				return ;
			}
			this.player1.client.emit('ball', this.getBall(1));
			this.player1.client.emit('players', this.getPlayers(1));
			this.player1.client.emit('score', this.getScore(1));
			this.player2.client.emit('ball', this.getBall(2));
			this.player2.client.emit('players', this.getPlayers(2));
			this.player2.client.emit('score', this.getScore(2));

			st();
		}, 10);

		st();
	}
}