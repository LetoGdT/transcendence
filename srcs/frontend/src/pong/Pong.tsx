import { red } from '@mui/material/colors';
import React, { useState } from 'react';
import PongGame from './pong_tools/PongGame';
import { socket } from '../WebsocketContext';

const GAME_WIDTH = 1040;
const GAME_HEIGHT = 680;

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

function useGame()
{
	const ref = React.useRef<PongGame>();
	if (!ref.current)
		ref.current = new PongGame(GAME_WIDTH, GAME_HEIGHT);
	return ref.current;
}

const PongGameBootstrap = () =>
{
	const [winner, setWinner] = useState(-1);
	const [lastUpdate, setLastUpdate] = useState(performance.now());
	const [attemptedConnect, setAttemptedConnect] = useState(false);
	
	const game = useGame();
	const canvasRef = useCanvas(ctx => game.render(ctx));
	
	// console.log('Asked q');
	React.useEffect(() =>
	{
		if (attemptedConnect === false)
		{
			socket.emit('queue', { type: 'Ranked' });
			setAttemptedConnect(true);
		}
		// socket.on('queuing', () => setIsQueuing(true));
		socket.on('ball', (data) => {
			setLastUpdate(performance.now());
			game.setBall(data);
		});
		socket.on('players', (data) => {
			setLastUpdate(performance.now());
			game.setPlayers(data);
		});
		socket.on('score', (data) => {
			setLastUpdate(performance.now());
			game.setScore(data);
		});
		socket.on('gameFound', () => game.setConnecting());
		socket.on('winner', (win: number) => setWinner(win));
		const timer = setInterval(() => {
			if (performance.now() - lastUpdate > 1000 / 50)
				game.update()
		}, 20);
		return () => clearInterval(timer);
	}, [game]);

	const onKeyUp = (e: React.KeyboardEvent) => {
		e.preventDefault();
		game.handleKeyUp(e.code);
		socket.emit('moveUp');
	};
	const onKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		game.handleKeyDown(e.code);
		socket.emit('moveDown');
	};

	return (
		<div style={{position: 'fixed', top:'200px', bottom:0, left:0, right:0}}>

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
}

const Pong = () =>
(
	<>
		<h1>PONG</h1>
		<div>
			<PongGameBootstrap/>
		</div>
	</>
);

export { Pong };
