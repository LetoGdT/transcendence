
const PLAYER_HEIGHT = 100; // TODO needs to be responsive
const PLAYER_WIDTH = 13; // TODO needs to be responsive

class Player
{
	public x: number;
	public y: number;
	public win: boolean;
	
	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.win = false; // TODO Alexis thinks it would be better in PongGame class
	}

	draw(ctx: CanvasRenderingContext2D)
	{
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	}
}

export { PLAYER_WIDTH, PLAYER_HEIGHT };
export default Player;
