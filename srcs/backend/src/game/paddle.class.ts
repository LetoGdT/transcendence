import { Object2D, Window, Vector2D } from '../interfaces/object2D.interface';

export class Paddle implements Object2D
{
	// The frame the paddle is in.
	readonly window: Window;

	// Paddle coordinates.
	readonly coordinates: Vector2D;

	// The current speed of the paddle.
	// Px / s
	readonly speed: number;

	// The size of the paddle.
	readonly height: number;
	readonly width: number;

	constructor(window: Window = {
			max: { x: 1040, y: 680 },
			min: { x: 0, y: 0 }
		},
		initial_coordinates: Vector2D = { x: 0, y: 0 },
		speed: number = 10, height: number = 10, width: number = 10)
	{
		this.window = window;
		this.coordinates = initial_coordinates;
		this.speed = speed;
		this.height = height;
		this.width = width;

		if (this.collides(this.coordinates))
			throw new RangeError('Paddle is not in the window')
	}

	collides(new_position: Vector2D): boolean
	{
		if (new_position.x + this.height > this.window.max.x || new_position.x < this.window.min.x)
			return true;
		return false;
	}
}