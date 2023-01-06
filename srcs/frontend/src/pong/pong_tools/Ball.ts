
const BALL_SPEED = 0.001;

class Ball
{
	public x: number;
	public y: number;
	public r: number;
	public speedX: number; // BALL_SPEED
	public speedY: number; //  BALL_SPEED

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
