import Ball, { BALL_SPEED } from "./Ball";
import Player, { PLAYER_WIDTH, PLAYER_HEIGHT } from "./Player";

const PLAYER1_DOWN_KEY = 'KeyS';
const PLAYER1_UP_KEY = 'KeyW';
const PLAYER2_DOWN_KEY = 'ArrowDown';
const PLAYER2_UP_KEY = 'ArrowUp';
const TIMER = 4500
const SECOND = 1500

class PongGame
{
	private width: number;
	private height: number;
    private player1: Player;
    private player2: Player;
	private scorePlayer1: number; // TODO only get it from the back. private or public ? 
	private scorePlayer2: number; // TODO only get it from the back. private or public ?
    private start: boolean = true; // Meaning game over
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

	sleep(ms: number)
	{
		return new Promise( resolve => setTimeout(resolve, ms) );
	}

	async render(ctx: CanvasRenderingContext2D)
	{
        // Clear the screen
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.width, this.height);

		if (this.start === true)
		{
			this.startScreen(ctx);
			this.start = false;
		}
		
		await this.sleep(TIMER);

		if (this.over === false)
        {
			this.drawNet(ctx)
			this.player1.draw(ctx);
 	 	    this.player2.draw(ctx);
	    	this.ball.draw(ctx);
			this.drawScore(ctx);
		}
		else if (this.over === true)
		{
			this.drawNet(ctx)
            this.ball.x = this.width / 2;
            this.ball.y = this.height / 2;
			this.player1.draw(ctx);
 	 	    this.player2.draw(ctx);
			this.drawScore(ctx);
		}
	}

	async startScreen(ctx: CanvasRenderingContext2D)
	{
		this.drawNet(ctx)
		this.player1.draw(ctx);
		this.player2.draw(ctx);
		this.drawScore(ctx);
		
		// Display set = start game
		ctx.lineWidth = 27;
		ctx.strokeStyle = 'white';
		// Draw 3
		ctx.fillStyle='white';
		ctx.fillRect(445, 225, 150, 27);
		ctx.fillRect(568, 252, 27, 200);
		ctx.fillRect(495, 325, 85, 27);
		ctx.fillRect(445, 425, 150, 27);
		console.log("A") // del
		await sleep(SECOND);
		console.log("B") // del
		// Erase 3
		ctx.fillStyle='black';
		ctx.fillRect(445, 225, 150, 27);
		ctx.fillRect(568, 252, 27, 200);
		ctx.fillRect(495, 325, 85, 27);
		ctx.fillRect(445, 425, 150, 27);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.setLineDash([5, 15]); // dotted line for the net
		ctx.moveTo(this.width / 2, 0);
		ctx.lineTo(this.width / 2, this.height);
		ctx.stroke();
		ctx.setLineDash([]); // sets the line back to solid
		// Draw 2
		ctx.fillStyle='white';
		ctx.fillRect(445, 225, 150, 27);
		ctx.fillRect(568, 252, 27, 100);
		ctx.fillRect(445, 325, 150, 27);
		ctx.fillRect(445, 325, 27, 100);
		ctx.fillRect(445, 425, 150, 27);
		await sleep(SECOND);
		// Erase 2
		ctx.fillStyle='black';
		ctx.fillRect(445, 225, 150, 27);
		ctx.fillRect(568, 252, 27, 100);
		ctx.fillRect(445, 325, 150, 27);
		ctx.fillRect(445, 325, 27, 100);
		ctx.fillRect(445, 425, 150, 27);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.setLineDash([5, 15]); // dotted line for the net
		ctx.moveTo(this.width / 2, 0);
		ctx.lineTo(this.width / 2, this.height);
		ctx.stroke();
		ctx.setLineDash([]); // sets the line back to solid
		// Draw 1
		ctx.fillStyle='white';
		ctx.fillRect(480, 225, 27, 27);
		ctx.fillRect(507, 225, 27, 200);
		await sleep(SECOND);
		// Erase 1
		ctx.fillStyle='black';
		ctx.fillRect(480, 225, 27, 27);
		ctx.fillRect(507, 225, 27, 200);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.setLineDash([5, 15]); // dotted line for the net
		ctx.moveTo(this.width / 2, 0);
		ctx.lineTo(this.width / 2, this.height);
		ctx.stroke();
		ctx.setLineDash([]); // sets the line back to solid
		console.log("D") // del
		// Erase 3
		await sleep(0);
		console.log("B") // del
	}

	drawNet(ctx: CanvasRenderingContext2D)
	{
		// Draw net
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.setLineDash([5, 15]); // dotted line for the net
		ctx.moveTo(this.width / 2, 0);
		ctx.lineTo(this.width / 2, this.height);
		ctx.stroke();
		ctx.setLineDash([]); // sets the line back to solid
	}

	drawScore(ctx: CanvasRenderingContext2D)
	{
		ctx.lineWidth = 8;
		ctx.strokeStyle = 'white';
		// ctx.lineJoin = 'square';
		
		// Draw player 1 score
		switch (this.scorePlayer1)
		{
			case 0:
			{
				ctx.beginPath();
				ctx.moveTo(240, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 160);
				ctx.lineTo(240, 160);
				ctx.lineTo(240, 96);
				ctx.stroke();
			}
				break;
			case 1:
			{
				ctx.beginPath();
				ctx.moveTo(257, 100);
				ctx.lineTo(270, 100);
				ctx.lineTo(270, 160);
				ctx.stroke();
			}
				break;
			case 2:
			{
				ctx.beginPath();
				ctx.moveTo(236, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 130);
				ctx.lineTo(240, 130);
				ctx.lineTo(240, 160);
				ctx.lineTo(284, 160);
				ctx.stroke();
			}
				break;
			case 3:
			{
				ctx.beginPath();
				ctx.moveTo(250, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 130);
				ctx.lineTo(260, 130);
				ctx.lineTo(280, 130);
				ctx.lineTo(280, 160);
				ctx.lineTo(250, 160);
				ctx.stroke();
			}
				break;
			case 4:
			{
				ctx.beginPath();
				ctx.moveTo(240, 100);
				ctx.lineTo(240, 140);
				ctx.lineTo(275, 140);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(260, 125);
				ctx.lineTo(260, 155);
				ctx.stroke();
			}
				break;
			case 5:
			{
				ctx.beginPath();
				ctx.moveTo(285, 100);
				ctx.lineTo(240, 100);
				ctx.lineTo(240, 130);
				ctx.lineTo(280, 130);
				ctx.lineTo(280, 160);
				ctx.lineTo(236, 160);
				ctx.stroke();
			}
				break;
			default: // never gets in
			{
				ctx.beginPath();
				ctx.moveTo(165, 100);
				ctx.moveTo(330, 100);
				ctx.moveTo(330, 200);
				ctx.moveTo(165, 200);
				ctx.moveTo(165, 100);
				ctx.stroke();
			}
		}

		// Draw player 2 score
		switch (this.scorePlayer2)
		{
			case 0:
			{
				ctx.beginPath();
				ctx.moveTo(760, 100);
				ctx.lineTo(800, 100);
				ctx.lineTo(800, 160);
				ctx.lineTo(760, 160);
				ctx.lineTo(760, 96);
				ctx.stroke();
			}
				break;
			case 1:
			{
				ctx.beginPath();
				ctx.moveTo(792, 100);
				ctx.lineTo(805, 100);
				ctx.lineTo(805, 160);
				ctx.stroke();
			}
				break;
			case 2:
			{
				ctx.beginPath();
				ctx.moveTo(771, 100);
				ctx.lineTo(815, 100);
				ctx.lineTo(815, 130);
				ctx.lineTo(775, 130);
				ctx.lineTo(775, 160);
				ctx.lineTo(819, 160);
				ctx.stroke();
			}
				break;
			case 3:
			{
				ctx.beginPath();
				ctx.moveTo(785, 100);
				ctx.lineTo(815, 100);
				ctx.lineTo(815, 130);
				ctx.lineTo(795, 130);
				ctx.lineTo(815, 130);
				ctx.lineTo(815, 160);
				ctx.lineTo(785, 160);
				ctx.stroke();
			}
				break;
			case 4:
			{
				ctx.beginPath();
				ctx.moveTo(775, 100);
				ctx.lineTo(775, 140);
				ctx.lineTo(810, 140);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(795, 125);
				ctx.lineTo(795, 155);
				ctx.stroke();
			}
				break;
			case 5:
			{
				ctx.beginPath();
				ctx.moveTo(819, 100);
				ctx.lineTo(775, 100);
				ctx.lineTo(775, 130);
				ctx.lineTo(815, 130);
				ctx.lineTo(815, 160);
				ctx.lineTo(771, 160);
				ctx.stroke();
			}
				break;
			default: // never gets in
			{
				ctx.beginPath();
				ctx.moveTo(165, 100);
				ctx.moveTo(330, 100);
				ctx.moveTo(330, 200);
				ctx.moveTo(165, 200);
				ctx.moveTo(165, 100);
				ctx.stroke();
			}
		}
	}

    async updatePhysics()
	{
        // await this.sleep(1000); // del
        // Rebounds on top and bottom
        if (this.ball.y > this.height || this.ball.y < 0)
        {
            this.ball.speedY *= -1;
        }

        // The ball reaches the right or left limit
        if (this.ball.x < PLAYER_WIDTH)
        {
            this.collide(this.player1);
        }
        else if (this.ball.x > this.width - PLAYER_WIDTH)
        {
            this.collide(this.player2);
        }

        // The ball's speed increases each time
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
    }
 
    async collide(opponent: Player)
    {
        // await this.sleep(5000); // del
        // The player misses the ball
        if (this.ball.y < opponent.y || this.ball.y > opponent.y + PLAYER_HEIGHT)
        {
            // The player who scores gets 1 point
            if (opponent == this.player1)
	        {
                this.scorePlayer2++;
			}
            else
			{
                this.scorePlayer1++;
			}
            // End of the this  playPscorePlayer1er has 5 points
            // console.log(this.scorePlayer1); // del
            // console.log(this.scorePlayer2); // del

            // console.log(this.over); // del	
            if (this.scorePlayer1 === 5 || this.scorePlayer2 === 5)
            {
                this.over = true
                console.log(this.over); // del 26
                // gameOver(); // del ?
                return;
            }
            // Set ball and players to the center
            this.ball.x = this.width / 2;
            this.ball.y = this.height / 2;
            this.player1.y = this.height / 2 - PLAYER_HEIGHT / 2;
            this.player2.y = this.height / 2 - PLAYER_HEIGHT / 2;

            // Reset speed
            this.ball.speedX = BALL_SPEED;
            this.ball.speedY = BALL_SPEED;
        }
		// The player hits the ball
        else
        {
            // Increase speed and change direction
            this.ball.x += 1;
			this.ball.speedX *= -1.2;
            this.changeDirection(opponent.y); // TODO needs to be implemented from js
        }
    }

	changeDirection(playerPosition: number)
	{
		let impact = this.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		let ratio = 100 / (PLAYER_HEIGHT / 2);
		// Get a value between 0 and 10
		this.ball.speedY = Math.round(impact * ratio / 10);
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
