'use strict';

let canvas; // del need type
let game; // del need type

const PLAYER_HEIGHT = 100
const PLAYER_WIDTH = 13
const BALL_SPEED = 5

// const moves =
// {
// 	87: {pressed: false, func: player1.moveUp},   // change it to 38
// 	83: {pressed: false, func: player1.moveDown}, // change it to 40
// 	38: {pressed: false, func: player2.moveUp},
// 	40: {pressed: false, func: player2.moveDown},
// }

const UP = 38
const DOWN = 40
const STEP = 12
const W = 87
const S = 83

function draw(score1, score2)
{
	let ctx = canvas.getContext('2d');

	// Draw field
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// Draw net
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.setLineDash([5, 15]); // dotted line for the net
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.setLineDash([]); // sets the line back to solid
	// Draw players
	ctx.fillStyle = 'white';
	ctx.fillRect(0, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	ctx.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	// Draw ball
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	ctx.fill();
	// Draw scores
	drawScore(ctx);
}

function drawScore(ctx)
{
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'white';
	ctx.lineJoin = 'square';
	
	// Draw player 1 score
	switch (game.player1.score)
	{
		case 0:
		{
			ctx.beginPath();
			ctx.moveTo(240, 100);
			ctx.lineTo(280, 100);
			ctx.lineTo(280, 160);
			ctx.lineTo(240, 160);
			ctx.lineTo(240, 96);
			ctx.stroke();
		}
			break;
		case 1:
		{
			ctx.beginPath();
			ctx.moveTo(257, 100);
			ctx.lineTo(270, 100);
			ctx.lineTo(270, 160);
			ctx.stroke();
		}
			break;
		case 2:
		{
			ctx.beginPath();
			ctx.moveTo(236, 100); // 1
			ctx.lineTo(280, 100); // 2
			ctx.lineTo(280, 130); // 3
			ctx.lineTo(240, 130); // 4
			ctx.lineTo(240, 160); // 5
			ctx.lineTo(284, 160); // 6
			ctx.stroke();
		}
			break;
		case 3:
		{
			ctx.beginPath();
			ctx.moveTo(250, 100);
			ctx.lineTo(280, 100);
			ctx.lineTo(280, 130);
			ctx.lineTo(260, 130);
			ctx.lineTo(280, 130);
			ctx.lineTo(280, 160);
			ctx.lineTo(250, 160);
			ctx.stroke();
		}
			break;
		case 4:
		{
			ctx.beginPath();
			ctx.moveTo(240, 100);
			ctx.lineTo(240, 140);
			ctx.lineTo(275, 140);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(260, 125);
			ctx.lineTo(260, 155);
			ctx.stroke();
		}
			break;
		case 5:
		{
			ctx.beginPath();
			ctx.moveTo(285, 100); // 2
			ctx.lineTo(240, 100); // 1
			ctx.lineTo(240, 130); // 4
			ctx.lineTo(280, 130); // 3
			ctx.lineTo(280, 160); // 6
			ctx.lineTo(236, 160); // 5
			ctx.stroke();
		}
			break;
		default: // never gets in
		{
			ctx.beginPath();
			ctx.moveTo(165, 100);
			ctx.moveTo(330, 100);
			ctx.moveTo(330, 200);
			ctx.moveTo(165, 200);
			ctx.moveTo(165, 100);
			ctx.stroke();
		}
	}

	// Draw player 2 score
	switch (game.player2.score)
	{
		case 0:
		{
			ctx.beginPath();
			ctx.moveTo(760, 100);
			ctx.lineTo(800, 100);
			ctx.lineTo(800, 160);
			ctx.lineTo(760, 160);
			ctx.lineTo(760, 96);
			ctx.stroke();
		}
			break;
		case 1:
		{
			ctx.beginPath();
			ctx.moveTo(792, 100);
			ctx.lineTo(805, 100);
			ctx.lineTo(805, 160);
			ctx.stroke();
		}
		case 2:
		{
			ctx.beginPath();
			ctx.moveTo(771, 100);
			ctx.lineTo(815, 100);
			ctx.lineTo(815, 130);
			ctx.lineTo(775, 130);
			ctx.lineTo(775, 160);
			ctx.lineTo(819, 160);
			ctx.stroke();
		}
			break;
		case 3:
		{
			ctx.beginPath();
			ctx.moveTo(785, 100);
			ctx.lineTo(815, 100);
			ctx.lineTo(815, 130);
			ctx.lineTo(795, 130);
			ctx.lineTo(815, 130);
			ctx.lineTo(815, 160);
			ctx.lineTo(785, 160);
			ctx.stroke();
		}
			break;
		case 4:
		{
			ctx.beginPath();
			ctx.moveTo(775, 100);
			ctx.lineTo(775, 140);
			ctx.lineTo(810, 140);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(795, 125);
			ctx.lineTo(795, 155);
			ctx.stroke();
		}
		case 5:
		{
			ctx.beginPath();
			ctx.moveTo(819, 100); // 2
			ctx.lineTo(775, 100); // 1
			ctx.lineTo(775, 130); // 4
			ctx.lineTo(815, 130); // 3
			ctx.lineTo(815, 160); // 6
			ctx.lineTo(771, 160); // 5
			ctx.stroke();
		}
			break;
		default: // never gets in
		{
			console.log('D'); // del
			ctx.beginPath();
			ctx.moveTo(165, 100);
			ctx.moveTo(330, 100);
			ctx.moveTo(330, 200);
			ctx.moveTo(165, 200);
			ctx.moveTo(165, 100);
			ctx.stroke();
		}
	}
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
	if (event.keyCode === S && game.player1.y <= canvas.height - PLAYER_HEIGHT) {
		game.player1.y += STEP;
	}
	if (event.keyCode === UP && game.player2.y >= 0)
	{
		game.player2.y -= STEP;
	}
	if (event.keyCode === DOWN && game.player2.y <= canvas.height - PLAYER_HEIGHT) {
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

function collide(opponent)
{
	// The player misses the ball
	if (game.ball.y < opponent.y || game.ball.y > opponent.y + PLAYER_HEIGHT) {
		// Draw scores
		game.opponent.score++;
		// Set ball and players to the center
		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2;
		game.player1.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

		// Reset speed
		game.ball.speed.x = BALL_SPEED;
		game.ball.speed.y = BALL_SPEED;
	}
	else
	{
		// Increase speed and change direction
		game.ball.speed.x *= -1.2;
		changeDirection(opponent.y);
	}
}

function changeDirection(playerPosition)
{
	let impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
	let ratio = 100 / (PLAYER_HEIGHT / 2);
	// Get a value between 0 and 10
	game.ball.speed.y = Math.round(impact * ratio / 10);
}

document.addEventListener('DOMContentLoaded', function ()
{
	canvas = document.getElementById('canvas');
	game =
	{
		player1:
		{
			y: canvas.height / 2 - PLAYER_HEIGHT / 2,
			score: 5
		},
		player2: // needs to be received from the other player, via the server
		{
			y: canvas.height / 2 - PLAYER_HEIGHT / 2,
			score: 5
		},
		ball:
		{
			x: canvas.width / 2,
			y: canvas.height / 2,
			r: 5,
			speed:
			{
				// x: BALL_SPEED,
				// y: BALL_SPEED
			}
		}
	};
	// window.addEventListener('keydown', (event)=>
	// {
	// 	if (moves[event.key])
	// 		moves[event.key].pressed = true;
	// });
	// window.addEventListener('keyup', (event)=>
	// {
	// 	if (moves[event.key])
	// 		moves[event.key].pressed = false;
	// });
	window.addEventListener('keydown', playerMove);
	play();
	// Mouvement du joueur
});