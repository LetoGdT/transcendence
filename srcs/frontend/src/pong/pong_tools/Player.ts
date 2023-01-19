
const PLAYER_HEIGHT = 100; // TODO needs to be responsive
const PLAYER_WIDTH = 13; // TODO needs to be responsive

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
		this.width = window.screen.width * 0.001; // TODO 0.1 enough ?
		this.height = window.screen.height * 0.01; // TODO 0.1 enough ?
		this.win = false; // TODO Alexis thinks it would be better in PongGame class
	}

	draw(ctx: CanvasRenderingContext2D)
	{
		this.width = window.screen.width * 0.001; // TODO 0.1 enough ?
		this.height = window.screen.height * 0.1; // TODO 0.1 enough ?
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

export { PLAYER_WIDTH, PLAYER_HEIGHT };
export default Player;
