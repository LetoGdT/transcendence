'use strict';

let canvas; // del need type
let game; // del need type

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

function draw() {
    var ctx = canvas.getContext('2d');
	
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
	ctx.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	ctx.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	// Draw ball
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	ctx.fill();
}
document.addEventListener
(
	'DOMContentLoaded', function ()
	{
	    canvas = document.getElementById('canvas');
		game =
		{
			player1:
			{
				y: canvas.height / 2 - PLAYER_HEIGHT / 2
	        },
	        player2:
			{
	        	y: canvas.height / 2 - PLAYER_HEIGHT / 2
	        },
	        ball:
			{
	        	x: canvas.width / 2,
	            y: canvas.height / 2,
	            r: 5
	        }
	    }
	    draw();
	}
);