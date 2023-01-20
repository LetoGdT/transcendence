
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 13;

class Player
{
	public x: number;
	public y: number;
	public width: number
	public height: number
	public win: boolean;
	
	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.width = PLAYER_WIDTH;
		this.height = PLAYER_HEIGHT;
		this.win = false; // TODO Alexis thinks it would be better in PongGame class
	}

	draw(ctx: CanvasRenderingContext2D)
	{
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

export { PLAYER_WIDTH, PLAYER_HEIGHT };
export default Player;
