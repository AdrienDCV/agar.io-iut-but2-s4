import Color from "color";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const player2 = new Player(200,200,50, new Color(`#AE1D23`), context, 'Parppaing', 0);
player1.drawDot();
player2.drawDot();

window.onkeydown = move;

canvas.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
	const relativeX = e.clientX - canvas.offsetLeft;
	const relativeY = e.clientY - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.clientWidth) {
	  player1.xPosition = relativeX - player1.radius / 2;
	}
	if (relativeY > 0 && relativeY < canvas.clientHeight) {
		player1.yPosition = relativeY - player1.radius / 2;
	}

	render();
}

function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	player1.drawDot();
	player2.drawDot();
	requestAnimationFrame(render);
}

function move(event) {
	// console.log(`${player1.xPosition}`);
	// console.log(`+ ${player1.xPosition < canvas.clientWidth}`);
	// console.log(`- ${player1.xPosition > canvas.clientWidth}`);
	
	if (player1.xPosition <= 0 || player1.xPosition <= canvas.clientWidth) {
		if (event.code == 'ArrowRight') {
			console.log(event.code);
			player1.xPosition += 5;
		}
	}

	if (player1.xPosition >= 0|| player1.xPosition >= canvas.clientWidth) {
		if (event.code == 'ArrowLeft') {
			console.log(event.code);
			player1.xPosition -= 5;
		}
	}

	if (player1.yPosition >= 0 || player1.yPosition >= canvas.clientHeight) {
		if (event.code == 'ArrowUp') {
			console.log(event.code);
			player1.yPosition -= 5;
		}
	}

	if (player1.yPosition <= 0|| player1.yPosition <= canvas.clientHeight) {
		if (event.code == 'ArrowDown') {
			console.log(event.code);
			player1.yPosition += 5;
		}
	}

	render();
}
