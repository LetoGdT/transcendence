import { red } from '@mui/material/colors';
import React, { useState, useEffect, useRef } from 'react';
import PongGame from './pong_tools/PongGame';
import { socket } from '../WebsocketContext';
import { useParams } from 'react-router-dom';

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
	spectate?: number;
}

const PongGameBootstrap = ({ spectate }: PongGameBootstrapProps) =>
{
	const game = gameInstance;
	game.newGame();
	const canvasRef = useCanvas(ctx => game.render(ctx));

	useEffect(() =>
	{
		if (!game.attemptedConnect) {
			if (spectate != null) {
				socket.emit('spectate', { game_id: spectate });
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
		socket.on('score', ({ score1, score2 }) => {
			game.setScore(score1, score2);
		});
		socket.on('win', ({ didWin }) => game.setOver(didWin));
		socket.on('gameFound', ({ countdown, player1, player2 }) => {
			game.setConnecting();
			game.setCountdownStart(Date.now() - countdown);
			game.setPlayers(player1, player2);
		});
		socket.on('queuing', () => game.statusMessage = 'Searching for an opponent...');
		socket.on('exception', e => {
			game.setErrorMessage(`Error: ${e.message}`);
		});
		socket.on('start', () => game.setStart());
		socket.on('state', state => game.netUpdateState(state));
	}, []);

	useEffect(() => {
		const timer = setInterval(() => game.update(), 20);
		return () => clearInterval(timer);
	}, []);

	// useEffect(() => {
	// 	game.handleMovement();
	// 	setMove(false);
	// }, [move]);

	const onKeyUp = (e: React.KeyboardEvent) => {
		e.preventDefault();
		// setMove(true);
		game.handleKeyUp(e.code);
	};
	const onKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		// setMove(true);
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
			<PongGameBootstrap />
		</div>
	</>
);

const SpectatePong = ({ }) => {
	const routeParams = useParams();
	const game_id = parseInt(routeParams.game_id!);

	return (
		<>
			<div>
				<PongGameBootstrap spectate={isNaN(game_id) ? -1 : game_id} />
			</div>
		</>
	);
};

export { Pong, SpectatePong };
