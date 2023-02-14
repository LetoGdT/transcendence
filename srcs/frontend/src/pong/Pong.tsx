import React, { useEffect } from 'react';
import PongGame from './pong_tools/PongGame';
import { socket } from '../WebsocketContext';
import { useParams } from 'react-router-dom';
import { PleaseConnect } from '../adaptable-zone';
import { LogInButton } from '../Header-zone';
import { Link } from 'react-router-dom';

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
		socket.on('win', ({ didWin }) => game.setOver(didWin));
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

	if (game.over === false){
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
		console.log("fini");//on y est pas apparemment
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
				<div>
					<Link to='/play'>
						<LogInButton variant="contained" disableRipple>
							OK
						</LogInButton>
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
			await fetch("http://localhost:9999/api/users/isconnected", {
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
			<>
				<div>
					<PongGameBootstrap {...props} game_id={game_id} />
				</div>
			</>
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

export function PongZone(){
	const routeParams = useParams();
	const game_id = parseInt(routeParams.game_id!);
	const [me, setMe] = React.useState<Boolean>(false);

	React.useEffect(() => {
		const api = async () => {
			await fetch("http://localhost:9999/api/users/isconnected", {
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
			<Pong />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		 );
	}
}
