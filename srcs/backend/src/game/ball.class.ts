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
	readonly speed: number;

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

	private latest_time: number = performance.now()

	constructor(paddle1: Paddle, paddle2: Paddle,
		window: Window = {
			max: { x: 1040, y: 680 },
			min: { x: 0, y: 0 }
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
		if (position.x + this.radius > this.window.max.x
			|| position.x - this.radius < this.window.min.x
			|| position.y + this.radius > this.window.max.y
			|| position.y - this.radius < this.window.min.y)
			return true;
		return false;
	}

	launchBallRandom(): void
	{
		this.direction.x = Math.random() * this.window.max.x / 2;
		this.direction.y = Math.random() * this.window.max.y / 2;
	}

	bounce(): void
	{
		if (this.collides(this.coordinates))
		{

		}
	}
}