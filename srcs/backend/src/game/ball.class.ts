import { Object2D, Window, Vector2D } from '../interfaces/object2D.interface';
import { Paddle } from './paddle.class';
import { Score } from './score.class';

export class Ball implements Object2D
{
	// The frame the ball is in.
	readonly window: Window;

	// Ball coordinates
	readonly coordinates: Vector2D;

	// The current speed of the ball
	speed: number;

	// The direction of the ball
	readonly direction: Vector2D;

	// A percentage of the current speed added at every bounce.
	// e.g: A value of 0.1 accelerates the ball by 10%.
	readonly acceleration: number;

	readonly refresh_rate: number;

	readonly radius: number;

	// These are ABSOLUTELY needed since they are passed by reference
	// and get modified in real time.
	private paddle1: Paddle;
	private paddle2: Paddle;

	private score: Score;

	private latest_time: number = performance.now();

	constructor(paddle1: Paddle, paddle2: Paddle,
		new_window: Window = {
			width: 1040,
			height: 680
		},
		refresh_rate: number = 50, initial_speed: number = 10,
		acceleration: number = 0.03, radius: number = 5,
		score: Score = new Score(5))
	{
		this.window = new_window;
		this.coordinates = { x: this.window.width / 2, y: this.window.height / 2 };
		this.speed = initial_speed;
		this.acceleration = acceleration;
		this.radius = radius;
		this.score = score;
		this.paddle1 = paddle1;
		this.paddle2 = paddle2;
		if (this.collides(this.coordinates))
			throw new RangeError('Ball is not in the window');
	}

	collides(position: Vector2D): boolean
	{
		return position.y + this.radius > this.window.height
			|| position.y - this.radius < 0;
	}

	paddleCollides(position: Vector2D): boolean
	{
		if ((position.x - this.radius <= this.paddle1.right
				&& position.y - this.radius < this.paddle1.top
				&& position.y + this.radius < this.paddle1.bottom)
			|| (position.x - this.radius <= this.paddle2.right
				&& position.y - this.radius < this.paddle2.top
				&& position.y + this.radius < this.paddle2.bottom))
			return true;
		return false;
	}

	launchBallRandom(): void
	{
		this.direction.y = Math.random() / 2;
		this.direction.x = Math.random() / 2;
	}

	bounce(): void
	{
		if (this.collides(this.coordinates))
		{
			this.coordinates.y -= 1;
			this.direction.y *= -1;
		}
	}

	paddleBounce(): void
	{
		if (this.paddleCollides(this.coordinates))
		{
			this.coordinates.x -= 1;
			this.direction.x *= -1;
			this.speed += this.speed * this.acceleration;
		}
		else
		{
			this.direction.x > 0 ? this.score.player1() : this.score.player2();
			this.reset();
		}
	}

	reset()
	{
		this.launchBallRandom();
		this.coordinates.x = this.window.width / 2;
		this.coordinates.y = this.window.height / 2;
	}

	// Je ne prend  pas en compte le délai que prend le for à s'exécuter, on verra si ça joue
	updateCoordinates(): void
	{
		const current_time = performance.now();
		let deltaTime = (current_time - this.latest_time) * (this.refresh_rate / 1000);
		for (; deltaTime >= 0; deltaTime--)
		{
			this.bounce();
			this.paddleBounce();
			this.coordinates.x += this.direction.x * this.speed;
			this.coordinates.y += this.direction.y * this.speed;
		}
		this.latest_time = current_time - deltaTime;
	}

	getCoordinates(): Vector2D
	{
		this.updateCoordinates();
		return this.coordinates;
	}
}