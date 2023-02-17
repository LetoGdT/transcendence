import './Pong.css'
import React, { useEffect } from 'react';
import { socket } from 'WebsocketContext';
import { useParams } from 'react-router-dom';
import { PleaseConnect } from '../adaptable-zone';
import { SignUpButton } from '../Header-zone';
import { Link } from 'react-router-dom';

const BALL_SPEED = 5;

class Ball{
	public x: number;
	public y: number;
	public r: number;//?
	public speedX: number;
	public speedY: number;

	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
		this.r = 5;
		this.speedX = BALL_SPEED;
		this.speedY = BALL_SPEED;
	}

	draw(ctx: CanvasRenderingContext2D){
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.fill();
	}
}

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 13;

class Player{
	public x: number;
	public y: number;
	public width: number
	public height: number
	
	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
		this.width = PLAYER_WIDTH;
		this.height = PLAYER_HEIGHT;
	}

	draw(ctx: CanvasRenderingContext2D){
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

const PLAYER1_DOWN_KEY = 'KeyS';
const PLAYER1_UP_KEY = 'KeyW';

const TICKRATE = 50;

interface NetworkedGameState{
	p1_y: number;
	p2_y: number;
	ball_x: number;
	ball_y: number;
	ball_dx: number;
	ball_dy: number;
	authoritative: boolean;
}

interface PongUserData{
	id: number;
	image_url: string;
	username: string;
}

class PongGame{
	public width: number;
	public height: number;
	private player1: Player;
	private player2: Player;
	private scorePlayer1: number;
	private scorePlayer2: number;
	private scoreToWin: number;
	private start: boolean = true; // Meaning start screen
	public over: boolean = false; // Meaning game over
	private ball: Ball;
	private keyStates: any;
	private timer: number;
	private connecting: boolean = true;
	private errorMessage: string = '';

	private startTimer: number;
	private currentTicks: number;

	private didWin: boolean = false;

	public attemptedConnect: boolean = false;
	public statusMessage: string = "Connecting...";

	private countdownStart: number = 0;
	
	public player1Data?: PongUserData;
	public player2Data?: PongUserData;

	private player1Image: HTMLImageElement | null;
	private player2Image: HTMLImageElement | null;

	private spectatorWinIndex: number = 0;

	constructor(width: number, height: number){
		this.width = width;
		this.height = height;
		this.player1 = new Player(0, (height - PLAYER_HEIGHT) / 2);
		this.player2 = new Player(
			width - PLAYER_WIDTH,
			(height - PLAYER_HEIGHT) / 2
		);
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
		this.scoreToWin = 50;

		this.ball = new Ball(width / 2, height / 2);
		this.keyStates = [];
		this.timer = 225;

		this.startTimer = 0;
		this.currentTicks = 0;

		this.player1Image = null;
		this.player2Image = null;
	}

	setPlayers(player1: PongUserData, player2: PongUserData){
		this.player1Data = player1;
		this.player2Data = player2;
	
		this.player1Image = new Image();
		this.player1Image.src = player1.image_url;
		this.player2Image = new Image();
		this.player2Image.src = player2.image_url;
	}

	setCountdownStart(countdownStart: number){
		this.countdownStart = countdownStart;
	}

	setErrorMessage(errorMessage: string){
		this.errorMessage = errorMessage;
	}

	setConnecting(){
		this.connecting = false;
		this.countdownStart = Date.now();
	}

	setStart(){
		this.start = false;
	}

	newGame(){
		this.start = true; // Meaning start screen
		this.over = false; // Meaning game over
		this.connecting = true;
		this.errorMessage = '';
		this.didWin = false;
		this.attemptedConnect = false;
		this.countdownStart = 0;
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
		this.player1 = new Player(0, (this.height - PLAYER_HEIGHT) / 2);
		this.player2 = new Player(
			this.width - PLAYER_WIDTH,
			(this.height - PLAYER_HEIGHT) / 2
		);
		this.spectatorWinIndex = 0;
		this.player1Image = null;
		this.player2Image = null;
		this.player1Data = undefined;
		this.player2Data = undefined;
	}

	drawStatusScreen(ctx: CanvasRenderingContext2D, label: string){
		const r = this.currentTicks * 10 / TICKRATE;

		const w = Math.sin(Date.now() * 0.005) * 10 + 30;

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(this.width / 2, this.height / 2, w, r, r + Math.PI / 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(
			this.width / 2,
			this.height / 2,
			w,
			r + Math.PI,
			r + Math.PI * 1.5
		);
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

	//a revoir pour ecrire victory/defeat
	drawUserNames(ctx: CanvasRenderingContext2D){
		ctx.fillStyle = 'white';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.font = '14px sans-serif';
		ctx.fillText(this.player1Data?.username!, 68, this.height - 20);
		
		ctx.textAlign = 'right';
		ctx.fillText(
			this.player2Data?.username!,
			this.width - 68,
			this.height - 20
		);

		this.drawUserAvatar(ctx, this.player1Image, 10, this.height - 48 - 10, 48, 48);
		this.drawUserAvatar(ctx, this.player2Image, this.width - 58, this.height - 48 - 10, 48, 48);
	}

	setSpectatorWin(playerIndex: number){
		this.spectatorWinIndex = playerIndex;
	}

	drawUserAvatar(
		ctx: CanvasRenderingContext2D,
		img: HTMLImageElement | null,
		x: number, y: number,
		imageWidth: number,
		imageHeight: number
	){
		if (null != img && img.complete) {
			const aspectRatio = img.width / Math.max(1, img.height);
			const fixedImageWidth = imageWidth * aspectRatio;

			ctx.save();
			ctx.translate(x, y);
			ctx.beginPath();
			ctx.arc(
				imageWidth / 2,
				imageHeight / 2,
				Math.min(imageWidth, imageHeight) / 2, 0, 2 * Math.PI,
				false
			);
			ctx.clip();
			ctx.drawImage(
				img,
				(imageWidth - fixedImageWidth) / 2,
				0,
				fixedImageWidth,
				imageHeight
			);
			ctx.restore();
		}
	}

	/**
	 * Called when the browser need to refresh the canvas
	 * @param ctx the rendering context of the canvas
	 */
	render(ctx: CanvasRenderingContext2D){
		// Clear the screen
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, this.width, this.height);

		if (this.errorMessage !== ''){
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
		this.drawUserNames(ctx);
		
		if (this.spectatorWinIndex > 0) {
			const w = this.width * 0.1;
			const yPos = (this.height * 0.5 - w) / 2;

			let text = '';

			if (this.spectatorWinIndex === 1) {
				this.drawUserAvatar(ctx, this.player1Image, (this.width - w) / 2, yPos, w, w);
				text = 'Player 1 Won';
			} else if (this.spectatorWinIndex === 2) {
				this.drawUserAvatar(ctx, this.player2Image, (this.width - w) / 2, yPos, w, w);
				text = 'Player 2 Won';
			}

			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '48px sans-serif';
			ctx.fillText(text, this.width / 2, yPos + 120);
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





const GAME_WIDTH = 1040;
const GAME_HEIGHT = 680;

const gameInstance = new PongGame(GAME_WIDTH, GAME_HEIGHT);

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) =>
{
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const resizeHandler = () => {
		if (canvasRef.current instanceof HTMLCanvasElement) {
			const c = canvasRef.current;
			const pixelRatio = window.devicePixelRatio || 1;

			c.width = c.clientWidth * pixelRatio;
			c.height = c.clientHeight * pixelRatio;
		}
	};

	React.useEffect(() => {
		window.addEventListener('resize', resizeHandler);

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}, []);

	React.useEffect(() =>
	{
		const canvas = canvasRef.current;
		let animFrameId: number;
		
		if (null === canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (null === ctx)
			return ;
		
		// Force a size update to keep it in sync
		resizeHandler();

		function render()
		{
			const c = ctx as CanvasRenderingContext2D;

			c.setTransform(
				c.canvas.width / GAME_WIDTH, 0,
				0, c.canvas.height / GAME_HEIGHT,0, 0);
			draw(c);

			animFrameId = window.requestAnimationFrame(render);
		}

		render();

		return () =>
		{
			window.cancelAnimationFrame(animFrameId);
		}
	}, [draw]);

	return canvasRef;
};

type PongGameBootstrapProps = {
	mode: 'spectate' | 'private' | 'ranked';
	game_id: number;
}

const PongGameBootstrap = ({ game_id, mode }: PongGameBootstrapProps) =>
{
	const game = gameInstance;
	const canvasRef = useCanvas(ctx => game.render(ctx));
	const [over, setOver] = React.useState<Boolean>(false);

	useEffect(() => {
		game.newGame();
		if (!game.attemptedConnect) {
			if (mode === 'spectate') {
				socket.emit('spectate', { game_id });
			} else if (mode === 'private') {
				socket.emit('join', { game_id });
			} else {
				socket.emit('queue', { type: 'Ranked' });
			}
			game.attemptedConnect = true;
		}
		return () => {
			game.attemptedConnect = false;
		};
	}, []);

	useEffect(() => {
		game.statusMessage = 'Connecting...';
		socket.on('score', ({ score1, score2 }) => {
			game.setScore(score1, score2);
		});
		socket.on('win', ({ didWin }) => {
			game.setOver(didWin);
			setOver(true);
		});
		socket.on('spectator-game-result', ({ id }) => {
			game.setSpectatorWin(id);
		});
		socket.on('gameFound', ({ countdown, player1, player2 }) => {
			game.setConnecting();
			game.setCountdownStart(Date.now() - countdown);
			game.setPlayers(player1, player2);
		});
		socket.on('queuing', () => game.statusMessage = 'Searching for an opponent...');
		socket.on('exception', e => {
			game.setErrorMessage(`Error: ${e.message}`);
		});
		socket.on('waitingForOpponent', ({ username }) => {
			game.statusMessage = `Waiting for ${username} to join.`;
		});
		socket.on('start', () => game.setStart());
		socket.on('state', state => game.netUpdateState(state));

		return () => {
			/* Notify the backend that we left the page */
			socket.emit('gameLeft');
		}
	}, []);

	useEffect(() => {
		const timer = setInterval(() => game.update(), 20);
		return () => clearInterval(timer);
	}, []);

	const onKeyUp = (e: React.KeyboardEvent) => {
		e.preventDefault();

		if (mode !== 'spectate') {
			game.handleKeyUp(e.code);
		}
	};
	const onKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();

		if (mode !== 'spectate') {
			game.handleKeyDown(e.code);
		}
	};

	console.log(game.over);//

	if (over === false){
		return (
			<div style={{position: 'fixed', top:'350px', bottom:'25px', left:0, right:0}}>
	
				<div style={{aspectRatio: 16 / 9 , maxHeight:'100%', maxWidth:'100%', marginLeft:'auto', marginRight:'auto'}}>
					<canvas
						id="responsive-canvas"
						ref={canvasRef}
						onKeyDown={onKeyDown}
						onKeyUp={onKeyUp}
						tabIndex={-1}
						>
					</canvas>
				</div>
			</div>
		);
	} else {
		return (
			<div className="Pong">
				<div style={{position: 'fixed', top:'350px', bottom:'25px', left:0, right:0}}>
		
					<div style={{aspectRatio: 16 / 9 , maxHeight:'100%', maxWidth:'100%', marginLeft:'auto', marginRight:'auto'}}>
						<canvas
							id="responsive-canvas"
							ref={canvasRef}
							onKeyDown={onKeyDown}
							onKeyUp={onKeyUp}
							tabIndex={-1}
							>
						</canvas>
					</div>
				</div>
				<div className="OKButton">
					<Link to='/play'>
						<SignUpButton variant="contained" disableRipple>
							OK
						</SignUpButton>
					</Link>
				</div>
			</div>
		);
	}
}

const Pong = (props: any) => {
	const routeParams = useParams();
	const game_id = parseInt(routeParams.game_id!);	
	const [me, setMe] = React.useState<Boolean>(false);

	React.useEffect(() => {
		const api = async () => {
			await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/isconnected`, {
				method: "GET",
				credentials: 'include'
			})
			.then((response) => {
				if (!response.ok)
					setMe(false);
				else
					setMe(true);
			});
		};
	
		api();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<div>
				<PongGameBootstrap {...props} game_id={game_id} />
			</div>
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		 );
	}
};

export { Pong };