export interface Object2D
{
	coordinates: Vector2D;
	speed: number;
	window: Window;
	collides(new_position: Vector2D): boolean;
}

export interface Window
{
	min: Vector2D;
	max: Vector2D;
}

export interface Vector2D
{
	x: number;
	y: number;
}