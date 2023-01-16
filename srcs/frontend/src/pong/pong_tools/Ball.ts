
const BALL_SPEED = 30; // TODO needs to be random (ball speed means 2 directions x and y)

class Ball
{
	public x: number;
	public y: number;
	public r: number;
	public speedX: number;
	public speedY: number;

	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.r = 5;
		this.speedX = BALL_SPEED;
		this.speedY = BALL_SPEED;
	}

	draw(ctx: CanvasRenderingContext2D)
	{
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.fill();
	}
}

export { BALL_SPEED };
export default Ball;
