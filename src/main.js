import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;	
const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const player2 = new Player(200,200,50, new Color(`#AE1D23`), context, 'Parppaing', 0); 
let dot1=new Dot(Math.random()*canvas.clientWidth,Math.random()*canvas.clientHeight,10,new Color('green'),context);
player1.drawDot();
player2.drawDot();
dot1.drawDot();

let dots=[]
for(let i=0; i<10;i++){
    dots[i]=new Dot(Math.random()*canvas.clientWidth,Math.random()*canvas.clientHeight,10,colors[Math.round(Math.random()*3)],context);
}
for(let i=0;i<10;i++){
    dots[i].drawDot();
}

window.onkeydown = move;
//window.onkeyup = stopMove;


function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	player1.drawDot();
	player2.drawDot();
    for(let i=0;i<10;i++){
        dots[i].drawDot();
    }

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



