import { Object2D, Window, Vector2D } from '../../interfaces/object2D.interface';

export class Paddle implements Object2D
{
	// The frame the paddle is in.
	readonly window: Window;

	// Paddle coordinates.
	readonly coordinates: Vector2D;

	// The current speed of the paddle.
	readonly speed: number;

	readonly refresh_rate: number;

	// The size of the paddle.
	readonly height: number;
	readonly width: number;

	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;

	private latest_time: number = performance.now();

	constructor(refresh_rate: number = 50, speed: number = 10,
		height: number = 10, width: number = 1,
		new_window: Window = {
			width: 1040,
			height: 680
		})
	{
		this.window = new_window;
		this.speed = speed;
		this.height = height;
		this.coordinates = { x: 10, y: this.window.height / 2 - this.height / 2 };
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
		const current_time = performance.now();
		const deltaTime = (current_time - this.latest_time) * (this.refresh_rate / 1000);
		if (deltaTime >= 1)
		{
			const new_position = this.coordinates;
			new_position.x += this.speed;
			if (!this.collides(new_position))
				this.coordinates.x += this.speed;
			this.latest_time = current_time;
		}
	}

	moveDown(): void
	{
		const current_time = performance.now();
		const deltaTime = (current_time - this.latest_time) * (this.refresh_rate / 1000);
		if (deltaTime >= 1)
		{
			const new_position = this.coordinates;
			new_position.x -= this.speed;
			if (!this.collides(new_position))
				this.coordinates.x -= this.speed;
			this.latest_time = current_time;
		}
	}
}