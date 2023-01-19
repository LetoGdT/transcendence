// import { bottomNavigationActionClasses } from '@mui/material'; // del where the h is it coming from ?
import { red } from '@mui/material/colors';
import React from 'react';
import PongGame from './pong_tools/PongGame';

const GAME_WIDTH = 1040; // TODO needs to be responsive, needs a function to get the value, based on the div maybe ?
const GAME_HEIGHT = 680; // TODO needs to be responsive, needs a function to get the value, based on the div maybe ?
// const HEIGHT_RATIO = 1.5; // del. to make the canvas responsive

const refreshSize = (ctx: HTMLCanvasElement) => // del new
{
	console.log(ctx.clientWidth); // TODO this function does nothing
	console.log(ctx.clientHeight);
}

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) =>
{
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const containerRef = React.useRef<HTMLElement>(null);

	React.useEffect(() =>
	{
		const canvas = canvasRef.current;
		let animFrameId: number;
		
		if(canvasRef.current) // del new
		refreshSize(canvasRef.current); // del new

		if (null === canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (null === ctx)
			return ;

		function render()
		{
			const c = canvas as HTMLCanvasElement;

			(ctx as CanvasRenderingContext2D).setTransform(
				c.clientWidth / GAME_WIDTH, 0,
				0, c.clientHeight / GAME_HEIGHT, 0, 0);


			(ctx as CanvasRenderingContext2D).setTransform(
				1, 0,
				0, 1, 0, 0);
			
			draw(ctx as CanvasRenderingContext2D);

			animFrameId = window.requestAnimationFrame(render);
		}

		render();

		return () => // TODO Ax
		{
			window.cancelAnimationFrame(animFrameId);
		}
	}, [draw]); // TODO Ax

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
	const game = useGame();
	const canvasRef = useCanvas(ctx => game.render(ctx))
	
	React.useEffect(() =>
	{
		const timer = setInterval(() => game.update(), 20);
		return () => clearInterval(timer);
	}, [game]);

	const onKeyUp = (e: React.KeyboardEvent) => {
		e.preventDefault();
		game.handleKeyUp(e.code);
	};
	const onKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		game.handleKeyDown(e.code);
	};

	return (
		/* del line underneath new */
		<div style={{position: 'fixed', top:'200px', bottom:0, left:0, right:0}} >

			<div style={{aspectRatio: 16 / 9 , maxHeight:'100%', maxWidth:'100%', marginLeft:'auto', marginRight:'auto'}} >
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
		/* del above width={GAME_WIDTH} and height={GAME_HEIGHT}> not responsive way */
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
