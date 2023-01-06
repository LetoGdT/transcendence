import Ball from "./Ball";
import Player, { PLAYER_WIDTH, PLAYER_HEIGHT } from "./Player";

class PongGame
{
	private width: number;
	private height: number;
    private player1: Player;
    private player2: Player;
    private ball: Ball;

    private keyPressed: boolean = false;

	constructor(width: number, height: number)
    {
		this.width = width;
		this.height = height;

        this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
        this.player2 = new Player(width - PLAYER_WIDTH, (height - PLAYER_HEIGHT) / 2);
        this.ball = new Ball(width / 2, height / 2);
	}

	/**
	 * Appelée quand le navigateur a besoin de rafraichir le canvas
	 * @param ctx Le context de rendu de canvas
	 */
	render(ctx: CanvasRenderingContext2D)
	{
        // Clear the screen
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.width, this.height);

        this.player1.draw(ctx);
        this.player2.draw(ctx);
        this.ball.draw(ctx);
	}

    updatePhysics()
	{
        // Rebounds on top and bottom
        if (this.ball.y > this.height || this.ball.y < 0)
        {
            this.ball.speedY *= -1;
        }

        // The ball reaches the left or right limit
        if (this.ball.x > this.width - PLAYER_WIDTH)
        {
            // collide(this.player2);
        }
        else if (this.ball.x < PLAYER_WIDTH)
        {
            // collide(this.player1);
        }

        // The ball's speed increases each time
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
    }

	/**
	 * Fonction appelée toutes les 20ms (50 Hz / 50 fois par seconde)
	 */
	update()
	{
        if (this.keyPressed)
		{
            this.player1.y -= 7;
            if (this.player1.y < 0)
                this.player1.y = 0;
        }

        this.updatePhysics();
	}

    handleKeyUp(code: string)
	{
        if (code === 'KeyW')
		{
            this.keyPressed = false;
        }
    }

    handleKeyDown(code: string)
	{
        if (code === 'KeyW')
		{
            this.keyPressed = true;
        }
    }

}

export default PongGame;
