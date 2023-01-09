import React from 'react';
import PongGame from './pong_tools/PongGame';

// TODO from Lucille. I think, the last line "export { Pong };" does the same
// import * as React from 'react';

// export function Pong(){
// 	let title: string = "PONG";

// 	return(
// 		<React.Fragment>
// 			<h1>{title}</h1>
// 			<div>

// 			</div>
// 		</React.Fragment>
// 	);
// }

const GAME_WIDTH = 1040; // TODO needs to be responsive
const GAME_HEIGHT = 680; // TODO needs to be responsive

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) =>
{
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() =>
	{
		const canvas = canvasRef.current;
		let animFrameId: number;

		if (null === canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (null === ctx)
			return ;

		function render()
		{
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
    console.log("B"); // del
	const ref = React.useRef<PongGame>();
	if (!ref.current)
		ref.current = new PongGame(GAME_WIDTH, GAME_HEIGHT);
	return ref.current;
}

const PongGameBootstrap = () =>
{
    console.log("A"); // del
	const game = useGame();
	const canvasRef = useCanvas(ctx => game.render(ctx))
	
	React.useEffect(() =>
	{
		const timer = setInterval(() => game.update(), 20);

		return () => clearInterval(timer);
	}, []);

	const onKeyUp = (e: React.KeyboardEvent) => game.handleKeyUp(e.code);
	const onKeyDown = (e: React.KeyboardEvent) => game.handleKeyDown(e.code);

	return (
		<canvas
			ref={canvasRef}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			tabIndex={-1}
			width={GAME_WIDTH}
			height={GAME_HEIGHT}></canvas>
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
