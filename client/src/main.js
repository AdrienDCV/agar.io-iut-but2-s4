import Color from "color";
import Dot from "./Dot.ts";
import Player from "./Player.ts";

import { io } from 'socket.io-client';

const socket = io();

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const entities = [];
const players = [];
const player1 = new Player(100,100,50, new Color(`#FF0000`), true, context, 'Parppaing', 0);
entities.push(player1);	
players.push(player1);

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];

function generateDots() {
	for(let i=1; i<2;i++){
		let x = (Math.random()*canvas.clientWidth);
		let y = (Math.random()*canvas.clientHeight);
		let colour = colors[Math.round(Math.random()*3)]
		entities[i] = (new Dot(x,y,10,colour,1, true,context));
	}
}	

generateDots();

function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	
	drawAliveEntities();

	entities.forEach(entity => {
		if (entity.alive === true) {
			entity.drawDot();
		}
	});
	playersDeplacements();
}

let mousePosition = {xPosition: undefined, yPosition: undefined};
canvas.addEventListener('mousemove', event => {
	mousePosition = {xPosition: event.clientX, yPosition: event.clientY};
} );

function drawAliveEntities() {
	entities.forEach(entity => {
		if (entity.alive === true) {
			entity.drawDot();
		}
	});
}

function playersDeplacements() {

	players.forEach(player => player.drawDot());

	if (mousePosition.xPosition != undefined && mousePosition.yPosition != undefined) {
		players.forEach(player => {			
			player.xPosition -= (player.xPosition - mousePosition.xPosition) * 0.0125;
			player.yPosition -= (player.yPosition - mousePosition.yPosition) * 0.0125;
		}); 		
		eatDotManager();
	}

	for(let i=1;i<dots.length;i++){
		if(dots[i]!=null){
			
		}

		if(dots[i].isEaten){
			dots[i]=null;
			
		}
	}
	
}

function eatDotManager() {
	entities.forEach(entity => {
		players.forEach(player => {
			if(player.xPosition+player.radius === entity.xPosition && player.yPosition+player.radius === entity.yPosition && player != entity){
				player.eats(entity);
				console.log(`entity eaten`);
			}
		})
	});
}

setInterval(render, 1000/60);