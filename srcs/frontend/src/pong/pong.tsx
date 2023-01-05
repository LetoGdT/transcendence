import React from 'react';
import PongGame from './tools/PongGame';

const GAME_WIDTH = 1040;
const GAME_HEIGHT = 680;

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		let animFrameId: number;

		if (null === canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (null === ctx)
			return ;

		function render() {
			draw(ctx as CanvasRenderingContext2D);

			animFrameId = window.requestAnimationFrame(render);
		}

		render();

		return () => {
			window.cancelAnimationFrame(animFrameId);
		}
	}, [draw]);

	return canvasRef;
};

const PongGameBootstrap = () => {
	const [game] = React.useState(() => new PongGame(GAME_WIDTH, GAME_HEIGHT));
	const canvasRef = useCanvas(ctx => game.render(ctx));

	React.useEffect(() => {
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

const Pong = () => (
	<>
		<h1>PONG</h1>
		<div>
			<PongGameBootstrap />
		</div>
	</>
);

export { Pong };
