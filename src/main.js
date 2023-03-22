import Color from "color";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;	

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const player2 = new Player(200,200,50, new Color(`#AE1D23`), context, 'Parppaing', 0);
player1.drawDot();
player2.drawDot();

window.onkeydown = move;
//window.onkeyup = stopMove;

function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	player1.drawDot();
	player2.drawDot();
	requestAnimationFrame(render);
}

window.onkeydown = move;

function move(event) {
	if (x < canvas.clientWidth - player1.radius*2 && x >= 0) {
		if (event.code == 'ArrowRight') {
			console.log(event.code);
			player1.xPosition += 5;
		}

		if (event.code == 'ArrowLeft') {
			console.log(event.code);
			player1.xPosition -= 5;
		}
	}

	if (y < canvas.clientHeight - player1.radius*2 && y >= 0) {
		if (event.code == 'ArrowDown') {
			console.log(event.code);
			player1.yPosition += 5;
		}

		if (event.code == 'ArrowUp') {
			console.log(event.code);
			player1.yPosition -= 5;
		}
	}

	x = player1.xPosition;
	y = player1.yPosition;

	render();
}
