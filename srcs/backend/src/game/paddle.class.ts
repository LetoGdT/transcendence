import { Object2D, Window, Vector2D } from '../interfaces/object2D.interface';

export class Paddle implements Object2D
{
	// The frame the paddle is in.
	readonly window: Window;

	// Paddle coordinates.
	readonly coordinates: Vector2D;

	// The current speed of the paddle.
	readonly speed: number;

	// The size of the paddle.
	readonly height: number;
	readonly width: number;

	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;

	constructor(window: Window = {
			width: 1040,
			height: 680
		},
		initial_coordinates: Vector2D = { x: 0, y: 0 },
		speed: number = 10, height: number = 10, width: number = 10)
	{
		this.window = window;
		this.coordinates = initial_coordinates;
		this.speed = speed;
		this.height = height;
		this.width = width;

		this.left = this.coordinates.x;
		this.right = this.left + this.width;
		this.bottom = this.coordinates.y;
		this.top = this.bottom + this.height;

		if (this.collides(this.coordinates))
			throw new RangeError('Paddle is not in the window');
	}

	collides(new_position: Vector2D): boolean
	{
		return new_position.y + this.height > this.window.height
			|| new_position.y < 0;
	}

	moveUp(): void
	{
		const new_position = this.coordinates;
		new_position.x += this.speed;
		if (!this.collides(new_position))
			this.coordinates.x += this.speed;
	}

	moveDown(): void
	{
		const new_position = this.coordinates;
		new_position.x -= this.speed;
		if (!this.collides(new_position))
			this.coordinates.x -= this.speed;
	}
}