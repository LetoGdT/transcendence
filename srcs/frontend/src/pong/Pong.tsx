import { red } from '@mui/material/colors';
import React, { useState, useEffect, useRef } from 'react';
import PongGame from './pong_tools/PongGame';
import { socket } from '../WebsocketContext';

// import { io } from 'socket.io-client';
// export const socket = io('http://localhost:1234', { transports: ['websocket'] });

const GAME_WIDTH = 1040;
const GAME_HEIGHT = 680;

const pongInstance = new PongGame(GAME_WIDTH, GAME_HEIGHT);

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

		return () => window.removeEventListener('resize', resizeHandler);
	}, []);

	React.useEffect(() =>
	{
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		let animFrameId: number;
		
		if (!canvas || !ctx)
			return ;
		
		// Force a size update to keep it in sync
		resizeHandler();

		function render()
		{
			ctx!.setTransform(
				ctx!.canvas.width / GAME_WIDTH, 0,
				0, ctx!.canvas.height / GAME_HEIGHT, 0, 0);
			draw(ctx!);

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

const PongGameBootstrap = () =>
{
	const [winner, setWinner] = useState(-1);
	const [lastUpdate, setLastUpdate] = useState(performance.now());
	const [attemptedConnect, setAttemptedConnect] = useState(false);
	const [checkRefresh, setCheckRefresh] = useState(false);
	const [move, setMove] = useState(false);
	
	const game = pongInstance;
	const canvasRef = useCanvas(ctx => game.render(ctx));

	useEffect(() =>
	{
		if (attemptedConnect === false)
		{
			socket.emit('queue', { type: 'Ranked' });
			game.setStatusMessage('Searching for an opponent...');
			setAttemptedConnect(true);
		}
		if (performance.now() - lastUpdate > 2000 / 50)
		{
			game.update();
			setLastUpdate(performance.now());
		}
		const sleep = async () => {
			await new Promise(r => setTimeout(r, 10));
			setCheckRefresh(!checkRefresh);
		}
		sleep();
	}, [checkRefresh]);

	useEffect(() => {
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
		socket.on('winner', (data) => {
			setLastUpdate(performance.now());
			game.setScore(data);
			game.update();
		});
		socket.on('exception', e => {
			game.setErrorMessage(`Error: ${e.message}`);
		});
		socket.on('start', () => game.setStart());
	}, []);

	useEffect(() => {
		game.handleMovement();
		setMove(false);
	}, [move]);

	const onKeyUp = (e: React.KeyboardEvent) => {
		e.preventDefault();
		setMove(true);
		game.handleKeyUp(e.code);
	};
	const onKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		setMove(true);
		game.handleKeyDown(e.code);
	};

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
}

const Pong = () =>
(
	<>
		<div>
			<PongGameBootstrap/>
		</div>
	</>
);

export { Pong };
