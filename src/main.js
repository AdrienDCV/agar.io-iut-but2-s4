import Color from "color";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const players = [];
players.push(player1);

function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	playersDeplacements();
	requestAnimationFrame(render);
	
}

let mousePosition = {xPosition: undefined, yPosition: undefined};
canvas.addEventListener('mousemove', event => {
	mousePosition = {xPosition: event.clientX, yPosition: event.clientY};
} );

function playersDeplacements() {

	players.forEach(player => player.drawDot());

	if (mousePosition.xPosition != undefined && mousePosition.yPosition != undefined) {
		players.forEach(player => {			
			player.xPosition -= (player.xPosition - mousePosition.xPosition) * 0.005;
			player.yPosition -= (player.yPosition - mousePosition.yPosition) * 0.005;
		}); 	
	}
	
}

requestAnimationFrame(render);