import Ball, { BALL_SPEED } from "./Ball";
import Player, { PLAYER_WIDTH, PLAYER_HEIGHT } from "./Player";

const PLAYER1_DOWN_KEY = 'KeyS';
const PLAYER1_UP_KEY = 'KeyW';
const PLAYER2_DOWN_KEY = 'ArrowDown';
const PLAYER2_UP_KEY = 'ArrowUp';

class PongGame
{
	private width: number;
	private height: number;
    private player1: Player;
    private player2: Player;
	private scorePlayer1: number; // TODO only get it from the back. private or public ? 
	private scorePlayer2: number; // TODO only get it from the back. private or public ?
    private over: boolean = false; // Meaning game over
    private ball: Ball;
    private keyStates: any;
    private movePlayer: boolean = false;


	constructor(width: number, height: number)
    {
		this.width = width;
		this.height = height;
        this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
        this.player2 = new Player(width - PLAYER_WIDTH, (height - PLAYER_HEIGHT) / 2);
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
        this.ball = new Ball(width / 2, height / 2);
        this.keyStates = [];
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
        // this.score1.draw(ctx);
        // this.score2.draw(ctx);
	}

    updatePhysics()
	{
        // Rebounds on top and bottom
        if (this.ball.y > this.height || this.ball.y < 0)
        {
            this.ball.speedY *= -1;
        }

        // The ball reaches the right or left limit
        if (this.ball.x < PLAYER_WIDTH)
        {
            console.log("A"); // del 5 9 13 17 21
            this.collide(this.player1);
        }
        else if (this.ball.x > this.width - PLAYER_WIDTH)
        {
            console.log("B"); // del 1
            this.collide(this.player2);
        }

        // The ball's speed increases each time
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
    }

    collide(opponent: Player)
    {
	    console.log("C"); // del 2 6 10 14 18 22
        // The player misses the ball
        if (this.ball.y < opponent.y || this.ball.y > opponent.y + PLAYER_HEIGHT)
        {
	        console.log("D"); // del 3 7 11 15 19 23
            // The player who scores gets 1 point
            if (opponent == this.player1)
	        {
                console.log("E"); // del 8 12 16 20 24
                this.scorePlayer2++;
			}
            else
			{
                console.log("F"); // del 4
                this.scorePlayer1++;
			}
            // End of the game when one player has 5 points
            // console.log(this.scorePlayer1); // del
            // console.log(this.scorePlayer2); // del

            // console.log(this.over); // del	
            if (this.scorePlayer1 === 5 || this.scorePlayer2 === 5)
            {
                console.log("G"); // del 25
                this.over = true
                console.log(this.over); // del 26
                gameOver();
                return;
            }
            // Set ball and players to the center
            this.ball.x = this.width / 2;
            this.ball.y = this.height / 2;
            this.player1.y = this.height / 2 - PLAYER_HEIGHT / 2;
            this.player2.y = this.height / 2 - PLAYER_HEIGHT / 2;

            // Reset speed
            this.ball.x = BALL_SPEED;
            this.ball.y = BALL_SPEED;
        }
        else
        {
            console.log("G"); // del
            // Increase speed and change direction
            this.ball.x *= -1.2;
            changeDirection(opponent.y);
        }
    }

	/**
	 * Fonction appelée toutes les 20ms (50 Hz / 50 fois par seconde)
	 */
	update()
	{
        if (this.keyStates[PLAYER1_UP_KEY])
		{
            this.player1.y -= 7;
            if (this.player1.y < 0)
                this.player1.y = 0;
        }

        if (this.keyStates[PLAYER1_DOWN_KEY])
		{
            this.player1.y += 7;
            if (this.player1.y < 0)
                this.player1.y = 0;
        }

        if (this.keyStates[PLAYER2_DOWN_KEY])
		{
            this.player2.y += 7;
            if (this.player2.y < 0)
                this.player2.y = 0;
        }

        if (this.keyStates[PLAYER2_UP_KEY])
		{
            this.player2.y -= 7;
            if (this.player2.y < 0)
                this.player2.y = 0;
        }

        this.updatePhysics();
	}

    handleKeyUp(code: string)
	{
        delete this.keyStates[code];
        if (code === 'KeyW')
		{
            this.movePlayer = false;
        }
    }

    handleKeyDown(code: string)
    {
        this.keyStates[code] = true;
        if (code === 'KeyS')
		{
            this.movePlayer = true;
        }
    }
}

export default PongGame;
