export interface Object2D
{
	coordinates: Vector2D;
	speed: number;
	window: Window;
	refresh_rate: number;
	collides(new_position: Vector2D): boolean;
}

export interface Window
{
	height: number;
	width: number;
}

export interface Vector2D
{
	x: number;
	y: number;
}