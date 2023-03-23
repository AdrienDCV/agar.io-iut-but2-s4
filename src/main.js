import Color from "color";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

console.log(canvas);

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const player2 = new Player(200,200,50, new Color(`#AE1D23`), context, canvas, 'Parppaing', 0);
const players = [];
players.push(player1, player2);

requestAnimationFrame(render);

function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	players.forEach(player => player.drawDot());
	followMouse();
	requestAnimationFrame(render);
}

let mouseX;
let mouseY;
canvas.addEventListener('mousemove', event => {
	mouseX = event.clientX;
	mouseY = event.clientY;
} );

function followMouse() {

	players.forEach(player => {			
		player.xPosition -= (player.xPosition - mouseX) * 0.005;
		player.yPosition -= (player.yPosition - mouseY) * 0.005;
	}); 
}

// function move(event) {
// 	// console.log(`${this.xPosition}`);
// 	// console.log(`+ ${this.xPosition < canvas.clientWidth}`);
// 	// console.log(`- ${this.xPosition > canvas.clientWidth}`);
	
// 	if (this.xPosition <= 0 || this.xPosition <= canvas.clientWidth) {
// 		if (event.code == 'ArrowRight') {
// 			console.log(event.code);
// 			this.xPosition += 5;
// 		}
// 	}

// 	if (this.xPosition >= 0|| this.xPosition >= canvas.clientWidth) {
// 		if (event.code == 'ArrowLeft') {
// 			console.log(event.code);
// 			this.xPosition -= 5;
// 		}
// 	}

// 	if (this.yPosition >= 0 || this.yPosition >= canvas.clientHeight) {
// 		if (event.code == 'ArrowUp') {
// 			console.log(event.code);
// 			this.yPosition -= 5;
// 		}
// 	}

// 	if (this.yPosition <= 0|| this.yPosition <= canvas.clientHeight) {
// 		if (event.code == 'ArrowDown') {
// 			console.log(event.code);
// 			this.yPosition += 5;
// 		}
// 	}

// 	render();
// }

function showCanvas() {};
setInterval(showCanvas, 1000/60);