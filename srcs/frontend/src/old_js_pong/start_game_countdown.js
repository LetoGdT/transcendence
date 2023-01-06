'use strict';

/*  when converting to typescript :
	sleep : const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
*/

let timer; // del need type

const PLAYER_HEIGHT = 100
const PLAYER_WIDTH = 13

async function startTimer()
{
	let ctx = timer.getContext('2d', { willReadFrequently: true });
	
	// Draw field
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, timer.width, timer.height);
	// Draw net
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.setLineDash([5, 15]); // dotted line for the net
	ctx.moveTo(timer.width / 2, 0);
	ctx.lineTo(timer.width / 2, timer.height);
	ctx.stroke();
	ctx.setLineDash([]); // sets the line back to solid
	// Draw players
	ctx.fillStyle = 'white';
	ctx.fillRect(0, timer.height / 2 - PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
	ctx.fillRect(timer.width - PLAYER_WIDTH, timer.height / 2 - PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
	// Draw score player 1
	ctx.beginPath();
	ctx.moveTo(240, 100);
	ctx.lineTo(280, 100);
	ctx.lineTo(280, 160);
	ctx.lineTo(240, 160);
	ctx.lineTo(240, 96);
	ctx.stroke();
	// Draw score player 2
	ctx.beginPath();
	ctx.moveTo(760, 100);
	ctx.lineTo(800, 100);
	ctx.lineTo(800, 160);
	ctx.lineTo(760, 160);
	ctx.lineTo(760, 96);
	ctx.stroke();
	
	// Saves the timer with an empty game field, so it can be used to "erase" the timer figures
	// let emptyField = ctx.getImageData(0, 0, timer.width, timer.height);
	
	// Display set = start game
	console.log("A") // del
	ctx.lineWidth = 27;
	ctx.strokeStyle = 'white';
	ctx.lineJoin = 'square';

	ctx.beginPath();
	ctx.moveTo(450, 240);
	ctx.lineTo(590, 240);
	ctx.lineTo(590, 340);
	ctx.lineTo(500, 340);
	ctx.lineTo(590, 340);
	ctx.lineTo(590, 440);
	ctx.lineTo(450, 440);
	ctx.stroke();
	// console.log("A") // del
	await sleep(2000);
	console.log("B") // del
}

function sleep(ms)
{
	// console.log("C") // del
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', async function ()
{
	timer = document.getElementById('timer');

	startTimer();
	sleep(3000);
	console.log("F") // del
	window.addEventListener('keydown', playerMove);
	console.log("J") // del
	play();
	// Mouvement du joueur
});