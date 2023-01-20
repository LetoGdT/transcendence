import React from 'react';
import PongGame from './pong_tools/PongGame';

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
	const game = useGame();
	const canvasRef = useCanvas(ctx => game.render(ctx))
	
	React.useEffect(() =>
	{
		const timer = setInterval(() => game.update(), 20); // del old version
		// const timer = setInterval(() =>  // TODO new version in progress (see with Tim how to create deltaTime in this front version)
			// if (this.deltaTime > 1)		// this is supposed to be called only when new information is received from the back
			// {							// meaning that update is called only if the front
			// 	game.update(), 20);			// version has to run on itself (predict the position of
			// }							// the ball, the players and the score). Else, update is
											// simply not called and the ball, players and score are
											// "updated" by the back. So you need another function,
											// for when it doesn't go inside front update, that will
											// update all the variables directly.
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
