import Ball, { BALL_SPEED } from "./Ball";
import Player, { PLAYER_WIDTH, PLAYER_HEIGHT } from "./Player";
import { socket } from '../../WebsocketContext';

const PLAYER1_DOWN_KEY = 'KeyS';
const PLAYER1_UP_KEY = 'KeyW';

const TICKRATE = 50;

interface Object2D
{
	x: number;
	y: number;
}

interface BallData
{
	coordinates: Object2D;
	speed: number;
	direction: Object2D;
}

interface Players
{
	player1:
	{
	  x: number,
	  y: number,
	},
	player2:
	{
	  x: number,
	  y: number,
	},
}

interface Score
{
	player1: number,
	player2: number,
}

interface NetworkedGameState {
	p1_y: number;
	p2_y: number;
	ball_x: number;
	ball_y: number;
	ball_dx: number;
	ball_dy: number;
	authoritative: boolean;
}

interface PongUserData {
	id: number;
	image_url: string;
	username: string;
}

class PongGame
{
	public width: number;
	public height: number;
	private player1: Player;
    private player2: Player;
	private scorePlayer1: number;
	private scorePlayer2: number;
	private scoreToWin: number;
    private start: boolean = true; // Meaning start screen
    private over: boolean = false; // Meaning game over
    private ball: Ball;
    private keyStates: any;
	private timer: number;
	private connecting: boolean = true;
	// private socket: Socket;
	private errorMessage: string = '';

	private startTimer: number;
	private currentTicks: number;

	private didWin: boolean = false;

	public attemptedConnect: boolean = false;
	public statusMessage: string = "Connecting...";

	private countdownStart: number = 0;
	
	private player1Data?: PongUserData;
	private player2Data?: PongUserData;

	private player1Image?: HTMLImageElement;
	private player2Image?: HTMLImageElement;

	constructor(width: number, height: number)
    {
		this.width = width;
		this.height = height;
        this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
        this.player2 = new Player(width - PLAYER_WIDTH, (height - PLAYER_HEIGHT) / 2);
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
		this.scoreToWin = 50; // TODO get it from slider on the webpage but set it in the back (maxscore) when game launched (customization option)

        this.ball = new Ball(width / 2, height / 2);
        this.keyStates = [];
		this.timer = 225;

		this.startTimer = 0;
		this.currentTicks = 0;
    }

	setPlayers(player1: PongUserData, player2: PongUserData) {
		this.player1Data = player1;
		this.player2Data = player2;
	
		this.player1Image = new Image();
		this.player1Image.src = player1.image_url;
		this.player2Image = new Image();
		this.player2Image.src = player2.image_url;
	}

	setCountdownStart(countdownStart: number) {
		this.countdownStart = countdownStart;
	}

	setErrorMessage(errorMessage: string) {
		this.errorMessage = errorMessage;
	}

	setConnecting()
	{
		this.connecting = false;
		this.countdownStart = Date.now();
	}

	setStart()
	{
		this.start = false;
	}

	newGame()
	{
		this.start = true; // Meaning start screen
		this.over = false; // Meaning game over
		this.connecting = true;
		this.errorMessage = '';
		this.didWin = false;
		this.attemptedConnect = false;
		this.countdownStart = 0;
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
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

		if (this.errorMessage !== '')
		{
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '18px sans-serif';
			ctx.fillText(this.errorMessage, this.width / 2, this.height / 2, Math.min(this.width, 200));
			return ;
		}
		else if (this.connecting)
		{
			this.drawStatusScreen(ctx, this.statusMessage);
			return ;
		}
		
		this.drawNet(ctx)
		this.player1.draw(ctx);
		this.player2.draw(ctx);

		ctx.fillStyle = 'white';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.font = '14px sans-serif';
		ctx.fillText(this.player1Data?.username!, 40, this.height - 20);
		
		ctx.textAlign = 'right';
		ctx.fillText(this.player2Data?.username!, this.width - 40, this.height - 20);

		if (null != this.player1Image && this.player1Image.complete) {
			// const img = this.player1Image;

			// const targetWidth = 32;
			// const targetHeight = 32;

			// const sx = -img.width / 2;
			// const sy = -img.height / 2;

			// ctx.drawImage(this.player1Image,
			// 	sx, sy, img.width, img.height,
			// 	10, this.height - 42, targetWidth, targetHeight);
		}

		if (this.start)
		{
			const timeSinceStart = (Date.now() - this.countdownStart) / 1000;

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
				if (this.didWin)
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
				else
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
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = '72px Georgia, serif';

		ctx.fillText(this.scorePlayer1.toString(), this.width / 4, 120);
		ctx.fillText(this.scorePlayer2.toString(), this.width / 4 * 3, 120);
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
	
	setOver(didWin: boolean) {
		this.over = true;
		this.didWin = didWin;
	}
 
    collide(opponent: Player)
    {
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
            // End of the game if one player reaches scoreToWin
            if (this.scorePlayer1 === this.scoreToWin || this.scorePlayer2 === this.scoreToWin)
            {
                this.over = true
                return;
            }
            // Set ball and players to the center
            this.ball.x = this.width / 2;
            this.ball.y = this.height / 2;

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
            this.changeDirection(opponent.y);
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
		this.currentTicks++;
		
		if (!this.over && !this.start)
		{
			this.handleMovement();
			// this.updatePhysics();

			socket.emit('move', { y: this.player1.y });
		}
	}

	setScore(score1: number, score2: number) {
		this.scorePlayer1 = score1;
		this.scorePlayer2 = score2;
	}

	netUpdateState(state: NetworkedGameState) {
		// this.player2.y = y;
		if (state.authoritative) {
			this.player1.y = state.p1_y;
		}

		this.player2.y = state.p2_y;
		this.ball.x = state.ball_x;
		this.ball.y = state.ball_y;
	}

	handleMovement()
	{
		const maxPlayerY = this.height - PLAYER_HEIGHT;

		if (this.keyStates[PLAYER1_UP_KEY])
		{
			// socket.emit('moveDown');
			this.player1.y -= 7;
			if (this.player1.y < 0)
				this.player1.y = 0;
		}

		if (this.keyStates[PLAYER1_DOWN_KEY])
		{
			// socket.emit('moveUp');
			this.player1.y += 7;
			if (this.player1.y >= maxPlayerY)
				this.player1.y = maxPlayerY;
		}
	}

    handleKeyUp(code: string)
	{
        delete this.keyStates[code];
    }

    handleKeyDown(code: string)
    {
        this.keyStates[code] = true;
    }
}

export default PongGame;
