'use strict';

let canvas; // del need type
let game; // del need type

const PLAYER_HEIGHT = 100
const PLAYER_WIDTH = 5
const BALL_SPEED = 8
const UP = 38
const DOWN = 40
const STEP = 12
const W = 87
const S = 83

function draw()
{
	let ctx = canvas.getContext('2d');
	
	// Draw field
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// Draw net
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.setLineDash([5, 15]);
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	// Draw players
	ctx.fillStyle = 'white';
	ctx.fillRect(0, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	ctx.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	// Draw ball
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	ctx.fill();
}

function play()
{
	draw();
	ballMove();
	requestAnimationFrame(play);
}

function playerMove(event)
{
	if (event.keyCode === W && game.player1.y >= 0)
	{
		game.player1.y -= STEP;
	}
	if (event.keyCode === S  && game.player1.y <= canvas.height - PLAYER_HEIGHT)
	{
		game.player1.y += STEP;
	}
	if (event.keyCode === UP && game.player2.y >= 0)
	{
		game.player2.y -= STEP;
	}
	if (event.keyCode === DOWN  && game.player2.y <= canvas.height - PLAYER_HEIGHT)
	{
		game.player2.y += STEP;
	}
}

function ballMove()
{
	// Rebounds on top and bottom
	if (game.ball.y > canvas.height || game.ball.y < 0)
	{
		game.ball.speed.y *= -1;
	}

	// The ball reaches the left or right limit
	if (game.ball.x > canvas.width - PLAYER_WIDTH)
	{
		collide(game.player2);
	}
	else if (game.ball.x < PLAYER_WIDTH)
	{
		collide(game.player1);
	}

	// The ball's speed increases each time
	game.ball.x += game.ball.speed.x;
	game.ball.y += game.ball.speed.y;
}

function collide(opponent) {
	// The player misses the ball
	if (game.ball.y < opponent.y || game.ball.y > opponent.y + PLAYER_HEIGHT) {
		// Set ball and players to the center
		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2;
		game.player1.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		
		// Reset speed
		game.ball.speed.x = BALL_SPEED;
		game.ball.speed.y = BALL_SPEED;
	} else {
		// Increase speed and change direction
		game.ball.speed.x *= -1.2;
	}
}

document.addEventListener('DOMContentLoaded', function ()
{
	canvas = document.getElementById('canvas');
	game =
	{
		player1:
		{
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		player2: // needs to be received from the other player, via the server
		{
			y: canvas.height / 2 - PLAYER_HEIGHT / 2
		},
		ball:
		{
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			speed:
			{
				x: BALL_SPEED,
				y: BALL_SPEED
			}
		}
	};
	window.addEventListener('keydown', playerMove);
	play();
	// Mouvement du joueur
});