
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 13;

class Player
{
	private x: number;
	private y: number;
	private score: number;
	private win: boolean;
	
	constructor(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.score = 0;
		this.win = false;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	}
}

export { PLAYER_WIDTH, PLAYER_HEIGHT };
export default Player;