import { Object2D, Window, Vector2D } from '../../interfaces/object2D.interface';
import { Paddle } from './paddle.class';
import { Score } from './score.class';

export class Ball implements Object2D
{
	// The frame the ball is in.
	readonly window: Window;

	// Ball coordinates
	readonly coordinates: Vector2D;

	readonly initial_speed: number;

	// The current speed of the ball
	speed: number;

	// The direction of the ball
	readonly direction: Vector2D = { x: 0, y: 0 };

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

	constructor(paddle1: Paddle, paddle2: Paddle, score: Score,
		refresh_rate: number = 50, initial_speed: number = 10,
		acceleration: number = 0.03, radius: number = 5,
		new_window: Window = {
			width: 1040,
			height: 680
		})
	{
		this.window = new_window;
		this.coordinates = { x: this.window.width / 2, y: this.window.height / 2 };
		this.speed = initial_speed;
		this.initial_speed = initial_speed;
		this.acceleration = acceleration;
		this.radius = radius;
		this.score = score;
		this.paddle1 = paddle1;
		this.paddle2 = paddle2;
		this.refresh_rate = refresh_rate;
		this.launchBallRandom();
	}

	async collides(): Promise<boolean>
	{
		return this.coordinates.y + this.radius > this.window.height
			|| this.coordinates.y - this.radius < 0;
	}

	async paddleCollides(): Promise<boolean>
	{
		if ((this.coordinates.x - this.radius <= this.paddle1.width
				&& this.coordinates.y - this.radius <= this.paddle1.top
				&& this.coordinates.y + this.radius >= this.paddle1.bottom)
			|| (this.coordinates.x + this.radius >= this.window.width - this.paddle2.width
				&& this.coordinates.y - this.radius <= this.paddle2.top
				&& this.coordinates.y + this.radius >= this.paddle2.bottom))
			return true;
		return false;
	}

	async launchBallRandom(): Promise<void>
	{
		this.direction.y = (Math.random() * 2 - 1) / 2;
		this.direction.x = Math.sqrt(1 - (this.direction.y * this.direction.y));
		if (Math.random() < 0.5)
			this.direction.x *= -1;
	}

	async bounce(): Promise<void>
	{
		if (await this.collides())
			this.direction.y *= -1;
	}

	async paddleBounce(): Promise<void>
	{
		if (await this.paddleCollides())
		{
			this.direction.x *= -1;
			// let impact = this.coordinates.y - this.paddle1.bottom - this.paddle1.height / 2;
			// let ratio = 100 / (this.paddle1.height / 2);
			// this.direction.y = Math.round(impact * ratio);
			if (this.speed <= 100)
				this.speed += this.speed * this.acceleration;
		}
		else if (this.coordinates.x - this.radius <= this.paddle1.width
			|| this.coordinates.x + this.radius >= this.window.width - this.paddle2.width)
		{
			try
			{
				this.direction.x < 0 ? await this.score.player1() : await this.score.player2();
			}
			catch (err)
			{
				this.direction.x = 0;
				this.direction.y = 0;
			}
			await this.reset();
		}
	}

	async reset()
	{
		await this.launchBallRandom();
		this.coordinates.x = this.window.width / 2;
		this.coordinates.y = this.window.height / 2;
		this.speed = this.initial_speed;
	}

	// Je ne prend  pas en compte le délai que prend le for à s'exécuter, on verra si ça joue
	async updateCoordinates(): Promise<void>
	{
		const current_time = performance.now();
		let deltaTime = (current_time - this.latest_time) * (this.refresh_rate / 1000);
		for (; deltaTime >= 0; deltaTime--)
		{
			await this.bounce();
			await this.paddleBounce();
			this.coordinates.x += this.direction.x * this.speed;
			this.coordinates.y += this.direction.y * this.speed;
		}
		this.latest_time = current_time - (deltaTime / ((1000 / this.refresh_rate)));
	}

	async getCoordinates(): Promise<{ coordinates: Vector2D, speed: number, direction: Vector2D }>
	{
		const ret = { x: this.coordinates.x, y: this.coordinates.y };
		const ret2 = { x: this.direction.x, y: this.direction.y };
		return { coordinates: ret, speed: this.speed, direction: ret2 };
	}
}