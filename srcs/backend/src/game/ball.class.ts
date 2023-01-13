import { Object2D, Window, Vector2D } from '../interfaces/object2D.interface';
import { Paddle } from './paddle.class';
import { performance } from "perf_hooks";

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

	readonly radius: number;

	// These are ABSOLUTELY needed since they are passed by reference
	// and get modified in real time.
	private paddle1: Paddle;
	private paddle2: Paddle;

	private latest_time: number = performance.now();

	private factor: number = 1;

	constructor(paddle1: Paddle, paddle2: Paddle,
		window: Window = {
			width: 1040,
			height: 680
		},
		initial_coordinates: Vector2D = { x: 520, y: 340 },
		initial_speed: number = 10, acceleration: number = 0.03, radius: number = 5)
	{
		this.window = window;
		this.coordinates = initial_coordinates;
		this.speed = initial_speed;
		this.acceleration = acceleration;
		this.radius = radius;
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
		if ((position.x - this.radius < this.paddle1.right
				&& position.y - this.radius < this.paddle1.top
				&& position.y + this.radius < this.paddle1.bottom)
			|| (position.x - this.radius < this.paddle2.right
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

	bounce(position: Vector2D): void
	{
		if (this.collides(position))
		{
			this.coordinates.y -= 1;
			this.direction.y *= -1;
		}
	}

	paddleBounce(position: Vector2D): void
	{
		if (this.paddleCollides(position))
		{
			this.coordinates.x -= 1;
			this.direction.x *= -1;
			this.speed += this.speed * this.acceleration;
		}
	}

	// Je ne prend  pas en compte le délai que prend le for à s'exécuter, on verra si ça joue
	updateCoordinates(): void
	{
		const current_time = performance.now();
		let deltaTime = (current_time - this.latest_time) * (60 / 1000);
		this.latest_time = current_time;
		for (; deltaTime >= 0; deltaTime--)
		{
			if (deltaTime > 0)
				this.factor = deltaTime;
			let new_coordinates: Vector2D = this.coordinates;
			new_coordinates.x += this.direction.x * this.speed;
		}

		this.factor = 1;
	}
}