'use strict';

let canvas; // del need type
let game; // del need type

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const UP = 38
const DOWN = 40
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

function play() {
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
    draw();
    requestAnimationFrame(play);
}

function playerMove(event)
{
	if (event.keyCode === UP && game.player1.y >= 0)
	{
		game.player1.y -= 7;
	}
	if (event.keyCode === DOWN  && game.player1.y <= canvas.height - PLAYER_HEIGHT)
	{
		game.player1.y += 7;
	}
	if (event.keyCode === W && game.player2.y >= 0)
	{
		game.player2.y -= 7;
	}
	if (event.keyCode === S  && game.player2.y <= canvas.height - PLAYER_HEIGHT)
	{
		game.player2.y += 7;
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
				x: 2,
				y: 2
			}
		}
	};
	window.addEventListener('keydown', playerMove);
	play();
	// Mouvement du joueur
});