// class Player {
// 	public x : number;
// 	public y : number;
// 	public w : number;
// 	public h : number;
	
// 	constructor(x: number, y: number, w: number, h: number) {
// 		this.x = x;
// 		this.y = y;
// 		this.w = w;
// 		this.h = h;
// 	}

// 	render(ctx: CanvasRenderingContext2D) {
// 		ctx.drawREctrangle(x, y ... )
// 	}
// }

// class Ball {}

// class Game {
// 	private player1 : Player;
// 	private player2 : Player;
// 	private ball : Ball;

// 	constructor(canvas: HTMLCanvasElement) {
// 		const playerHeight = 40;

// 		this.player1 = new Player(10, (canvas.height - playerHeight) / 2, 10, playerHeight);
// 		this.player2 = new Player(canvas.width - 10 - 10, (canvas.height - playerHeight) / 2, 10, playerHeight);
// 	}

// 	render(ctx: CanvasRenderingContext2D) {
// 		this.player1.render(ctx);
// 		this.player2.render(ctx);
// 		this.ball.render(ctx);
// 	}

// 	update() {
// 		/* collisions */
		
// 	}
// }

// function start(canvas: HTMLCanvasElement) {
// 	const game = new Game(canvas);

// 	function doRender() {
// 		game.render(canvas.getContext('2d') as CanvasRenderingContext2D);

// 		window.requestAnimationFrame(doRender);
// 	}

// 	setInterval(() => game.update(), 20);

// 	doRender();
// }