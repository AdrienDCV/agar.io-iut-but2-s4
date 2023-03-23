import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const players = [];
players.push(player1);

let you=new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);	

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];

const dots = [];

function generateDots() {
	for(let i=1; i<50;i++){
		dots[i] = (new Dot((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context));
	}
}	

generateDots();
function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	dots.forEach(dot => dot.drawDot());
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