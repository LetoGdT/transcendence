import Ball, { BALL_SPEED } from "./Ball";
import Player, { PLAYER_WIDTH, PLAYER_HEIGHT } from "./Player";
// import { io, Socket } from 'socket.io-client'; // TODO uncomment when you use socketd

const PLAYER1_DOWN_KEY = 'KeyS';
const PLAYER1_UP_KEY = 'KeyW';
const PLAYER2_DOWN_KEY = 'ArrowDown';
const PLAYER2_UP_KEY = 'ArrowUp';
// const TIMER = 4500 // del not used anymore ?
// const SECOND = 1500 // del not used anymore ?

const TICKRATE = 50;

class PongGame
{
	public width: number;
	public height: number;
	private player1: Player;
    private player2: Player;
	private scorePlayer1: number; // TODO only get it from the back. private or public ? 
	private scorePlayer2: number; // TODO only get it from the back. private or public ?
	private scoreToWin: number;
    private start: boolean = true; // Meaning game over
    private over: boolean = false; // Meaning game over
    private ball: Ball;
    private keyStates: any;
    private movePlayer: boolean = false;
	private timer: number; // del ?
	// private connecting: boolean = true;
	// private socket: Socket;

	private startTimer: number;
	private currentTicks: number;

	constructor(width: number, height: number)
    {
		this.width = width;
		this.height = height;
		// this.refreshSize(width, height);
        this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
		// this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
        this.player2 = new Player(width - PLAYER_WIDTH, (height - PLAYER_HEIGHT) / 2);
		// this.player2 = new Player(width - PLAYER_WIDTH, (height - PLAYER_HEIGHT) / 2);
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
		this.scoreToWin = 5; // TODO get it from slider in the front when game launched (customization option)

        this.ball = new Ball(width / 2, height / 2);
        this.keyStates = [];
		this.timer = 225;

		this.startTimer = 0;
		this.currentTicks = 0;

		// this.socket = io('http://localhost:1234', { transports: [ 'websocket' ] });
		// this.socket.on('connect', () => {
			// this.connecting = false;
		// });
    }

	// refreshSize(width: number, height: number)
	// {
	// 	this.width = width;
	// 	this.height = height;
	// }

	canvasResponsiveWidth()
	{
		const x: number = window.screen.width; // TODO needs more stuff in the calculation
		// return(x);
		return this.width;
	}

	canvasResponsiveHeight()
	{
		const y: number = window.screen.height; // TODO needs more stuff in the calculation
		// return(y);
		return this.height;
	}

	responsivePlayerWidth()
	{
		const height: number = this.height * 0.2; // TODO test it, is 0.2 right ?
		// return(height);/
		return PLAYER_WIDTH;
	}

	responsivePlayerHeight()
	{
		const height: number = this.height * 0.2; // TODO test it, is 0.2 right ?
		// return(height);
		return PLAYER_HEIGHT;
	}

	drawStatusScreen(ctx: CanvasRenderingContext2D, label: string) {
		const r = this.currentTicks * 10 / TICKRATE;

		const w = Math.sin(Date.now() * 0.005) * 10 + 30;

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(this.width / 2, this.height / 2, w, r, r + Math.PI / 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.width / 2, this.height / 2, w, r + Math.PI, r + Math.PI * 1.5);
		ctx.stroke();

		const w2 = Math.sin(1 + Date.now() * 0.005) * 10 + 30;

		ctx.beginPath();
		ctx.arc(this.width / 2, this.height / 2, w2, 0, Math.PI * 2);
		ctx.stroke();

		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.font = '18px sans-serif';
		ctx.fillText(label, this.width / 2, this.height / 2 + 70);
	}

	/**
	 * Called when the browser need to refresh the canvas
	 * @param ctx the rendering context of the canvas
	 */
	render(ctx: CanvasRenderingContext2D)
	{
        // Clear the screen
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.width, this.height);

		// if (this.connecting)
		// {
			// this.drawStatusScreen(ctx, 'Connecting...');
			// return ;
		// }
		
		this.drawNet(ctx)
		this.player1.draw(ctx);
		this.player2.draw(ctx);

		if (this.start)
		{
			const timeSinceStart = this.startTimer / TICKRATE / 1.5;

			this.drawScore(ctx);

			// Display set = start game
			ctx.lineWidth = 27;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'white';
			if (timeSinceStart < 1) {
				// Draw 3
				ctx.fillRect(445, 225, 150, 27);
				ctx.fillRect(568, 252, 27, 200);
				ctx.fillRect(495, 325, 85, 27);
				ctx.fillRect(445, 425, 150, 27);
			} else if (timeSinceStart < 2) {
				// Draw 2
				ctx.fillStyle='white';
				ctx.fillRect(445, 225, 150, 27);
				ctx.fillRect(568, 252, 27, 100);
				ctx.fillRect(445, 325, 150, 27);
				ctx.fillRect(445, 325, 27, 100);
				ctx.fillRect(445, 425, 150, 27);
			} else if (timeSinceStart < 3) {
				// Draw 1
				ctx.fillStyle='white';
				ctx.fillRect(480, 225, 27, 27);
				ctx.fillRect(507, 225, 27, 200);
			}
		}
		else
		{
			if (this.over === false)
			{
				this.ball.draw(ctx);
				this.drawScore(ctx);
			}
			else
			{
				this.ball.x = this.width / 2;
				this.ball.y = this.height / 2;
				this.drawScore(ctx);
				if (this.scorePlayer1 === this.scoreToWin)
				{
					// Draw 'VICTORY'
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 20;
					// Draw 'V'
					ctx.beginPath();
					ctx.moveTo(145, 270);
					ctx.lineTo(195, 390);
					ctx.lineTo(245, 270);
					ctx.stroke();
					// Draw 'I'
					ctx.beginPath();
					ctx.moveTo(290, 265);
					ctx.lineTo(290, 415);
					ctx.stroke();
					// Draw 'C'
					ctx.beginPath();
					ctx.moveTo(415, 275);
					ctx.lineTo(340, 275);
					ctx.lineTo(340, 405);
					ctx.lineTo(415, 405);
					ctx.stroke();
					// Draw 'T'
					ctx.beginPath();
					ctx.moveTo(445, 275);
					ctx.lineTo(540, 275);
					ctx.stroke();
					ctx.moveTo(492, 275);
					ctx.lineTo(492, 415);
					ctx.stroke();
					// Draw 'O'
					ctx.beginPath();
					ctx.moveTo(580, 275);
					ctx.lineTo(655, 275);
					ctx.lineTo(655, 405);
					ctx.lineTo(580, 405);
					ctx.lineTo(580, 265);
					ctx.stroke();
					// Draw 'R'
					ctx.beginPath();
					ctx.moveTo(705, 265);
					ctx.lineTo(705, 415);
					ctx.stroke();
					ctx.moveTo(705, 275);
					ctx.lineTo(780, 275);
					ctx.lineTo(780, 340);
					ctx.lineTo(720, 340);
					ctx.lineTo(780, 410);
					ctx.stroke();
					// Draw 'Y'
					ctx.beginPath();
					ctx.moveTo(830, 272);
					ctx.lineTo(877, 335);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(915, 272);
					ctx.lineTo(830, 415);
					ctx.stroke();
				}
				else if (this.scorePlayer2 === 5)
				{
					// Draw 'DEFEAT'
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 20;
					// Draw 'D'
					ctx.beginPath();
					ctx.moveTo(145, 275);
					ctx.lineTo(220, 290);
					ctx.lineTo(220, 390);
					ctx.lineTo(145, 405);
					ctx.lineTo(145, 275);
					ctx.lineTo(220, 290);
					ctx.stroke();
					// Draw 'E'
					ctx.beginPath();
					ctx.moveTo(365, 275);
					ctx.lineTo(290, 275);
					ctx.lineTo(290, 405);
					ctx.lineTo(365, 405);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(290, 340);
					ctx.lineTo(330, 340);
					ctx.stroke();
					// Draw 'F'
					ctx.beginPath();
					ctx.moveTo(425, 415);
					ctx.lineTo(425, 275);
					ctx.lineTo(500, 275);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(425, 320);
					ctx.lineTo(465, 320);
					ctx.stroke();
					// Draw 'E'
					ctx.beginPath();
					ctx.moveTo(635, 275);
					ctx.lineTo(560, 275);
					ctx.lineTo(560, 405);
					ctx.lineTo(635, 405);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(560, 340);
					ctx.lineTo(600, 340);
					ctx.stroke();
					// Draw 'A'
					ctx.beginPath();
					ctx.moveTo(695, 415);
					ctx.lineTo(695, 275);
					ctx.lineTo(770, 275);
					ctx.lineTo(770, 415);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(695, 330);
					ctx.lineTo(770, 330);
					ctx.stroke();
					// Draw 'T'
					ctx.beginPath();
					ctx.moveTo(830, 275);
					ctx.lineTo(925, 275);
					ctx.stroke();
					ctx.moveTo(877, 275);
					ctx.lineTo(877, 415);
					ctx.stroke();
				}
			}
		}
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
				ctx.beginPath();
				ctx.moveTo(240, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 160);
				ctx.lineTo(240, 160);
				ctx.lineTo(240, 96);
				ctx.stroke();
				break;
			case 1:
				ctx.beginPath();
				ctx.moveTo(257, 100);
				ctx.lineTo(270, 100);
				ctx.lineTo(270, 160);
				ctx.stroke();
				break;
			case 2:
				ctx.beginPath();
				ctx.moveTo(236, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 130);
				ctx.lineTo(240, 130);
				ctx.lineTo(240, 160);
				ctx.lineTo(284, 160);
				ctx.stroke();
				break;
			case 3:
				ctx.beginPath();
				ctx.moveTo(250, 100);
				ctx.lineTo(280, 100);
				ctx.lineTo(280, 130);
				ctx.lineTo(260, 130);
				ctx.lineTo(280, 130);
				ctx.lineTo(280, 160);
				ctx.lineTo(250, 160);
				ctx.stroke();
				break;
			case 4:
				ctx.beginPath();
				ctx.moveTo(240, 100);
				ctx.lineTo(240, 140);
				ctx.lineTo(275, 140);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(260, 125);
				ctx.lineTo(260, 155);
				ctx.stroke();
				break;
			case 5:
				ctx.beginPath();
				ctx.moveTo(285, 100);
				ctx.lineTo(240, 100);
				ctx.lineTo(240, 130);
				ctx.lineTo(280, 130);
				ctx.lineTo(280, 160);
				ctx.lineTo(236, 160);
				ctx.stroke();
				break;
			default: // never gets in
				ctx.beginPath();
				ctx.moveTo(165, 100);
				ctx.moveTo(330, 100);
				ctx.moveTo(330, 200);
				ctx.moveTo(165, 200);
				ctx.moveTo(165, 100);
				ctx.stroke();
		}

		// Draw player 2 score
		switch (this.scorePlayer2)
		{
			case 0:
				ctx.beginPath();
				ctx.moveTo(760, 100);
				ctx.lineTo(800, 100);
				ctx.lineTo(800, 160);
				ctx.lineTo(760, 160);
				ctx.lineTo(760, 96);
				ctx.stroke();
				break;
			case 1:
				ctx.beginPath();
				ctx.moveTo(792, 100);
				ctx.lineTo(805, 100);
				ctx.lineTo(805, 160);
				ctx.stroke();
				break;
			case 2:
				ctx.beginPath();
				ctx.moveTo(771, 100);
				ctx.lineTo(815, 100);
				ctx.lineTo(815, 130);
				ctx.lineTo(775, 130);
				ctx.lineTo(775, 160);
				ctx.lineTo(819, 160);
				ctx.stroke();
				break;
			case 3:
				ctx.beginPath();
				ctx.moveTo(785, 100);
				ctx.lineTo(815, 100);
				ctx.lineTo(815, 130);
				ctx.lineTo(795, 130);
				ctx.lineTo(815, 130);
				ctx.lineTo(815, 160);
				ctx.lineTo(785, 160);
				ctx.stroke();
				break;
			case 4:
				ctx.beginPath();
				ctx.moveTo(775, 100);
				ctx.lineTo(775, 140);
				ctx.lineTo(810, 140);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(795, 125);
				ctx.lineTo(795, 155);
				ctx.stroke();
				break;
			case 5:
				ctx.beginPath();
				ctx.moveTo(819, 100);
				ctx.lineTo(775, 100);
				ctx.lineTo(775, 130);
				ctx.lineTo(815, 130);
				ctx.lineTo(815, 160);
				ctx.lineTo(771, 160);
				ctx.stroke();
				break;
			default: // never gets in
				ctx.beginPath();
				ctx.moveTo(165, 100);
				ctx.moveTo(330, 100);
				ctx.moveTo(330, 200);
				ctx.moveTo(165, 200);
				ctx.moveTo(165, 100);
				ctx.stroke();
		}
	}

    updatePhysics()
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
 
    collide(opponent: Player)
    {
        // await this.sleep(5000); // del
        // The player misses the ball
        if (this.ball.y < opponent.y || this.ball.y > opponent.y + PLAYER_HEIGHT)
        {
            // The player who scores gets 1 point
            if (opponent === this.player1)
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

	// Function called every 20ms (50 Hz / 50 times per second)
	update()
	{
		this.width = this.canvasResponsiveWidth(); // TODO doest it work fine ?
		this.height = this.canvasResponsiveHeight(); // TODO doest it work fine ?

		this.currentTicks++;
		
		if (this.start)
		{
			this.startTimer++;

			if (this.startTimer >= (TICKRATE * 1.5 * 3))
			{
				this.start = false;
			}
		} 
		else if (!this.over)
		{
			const maxPlayerY = this.height - PLAYER_HEIGHT;

			if (this.keyStates[PLAYER1_UP_KEY])
			{
				this.player1.y -= 7;
				if (this.player1.y < 0)
					this.player1.y = 0;
			}

			if (this.keyStates[PLAYER1_DOWN_KEY])
			{
				this.player1.y += 7;
				if (this.player1.y >= maxPlayerY)
					this.player1.y = maxPlayerY;
			}

			if (this.keyStates[PLAYER2_DOWN_KEY])
			{
				this.player2.y += 7;
				if (this.player2.y >= maxPlayerY)
					this.player2.y = maxPlayerY;
			}

			if (this.keyStates[PLAYER2_UP_KEY])
			{
				this.player2.y -= 7;
				if (this.player2.y < 0)
					this.player2.y = 0;
			}

			this.updatePhysics();
		}
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
