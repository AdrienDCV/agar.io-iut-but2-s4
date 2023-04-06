import { io, Socket } from 'socket.io-client';

import Player from '../../common/Player';
import Dot from '../../common/Dot';

import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';
import Router from './Router';

const canvas: HTMLCanvasElement = document.querySelector(
	'.gameCanvas'
) as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext(
	'2d'
) as CanvasRenderingContext2D;

let playerLocal: Player;

let entitiesList: Dot[] = [];
let playersList: Player[] = [];
let foods: Dot[] = [];

const mousePosition = {
	xPosition: 0,
	yPosition: 0,
};

canvas.addEventListener('mousemove', event => {
	mousePosition.xPosition = event.clientX;
	mousePosition.yPosition = event.clientY;
});

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.emit('join', 'Adrien', '#FF0000', context);

socket.on('sendGameAssets', (entitiesListServ, playersListServ) => {
	let entity: Dot;
	entitiesListServ.forEach(entityServ => {
		entity = new Dot(
			entityServ.xPosition,
			entityServ.yPosition,
			entityServ.radius,
			entityServ.colour,
			1,
			entityServ.alive,
			context
		);
		entitiesList.push(entity);
	});

	let player: Player;
	playersListServ.forEach(playerServ => {
		player = new Player(
			playerServ.xPosition,
			playerServ.yPosition,
			playerServ.radius,
			playerServ.colour,
			playerServ.alive,
			context,
			playerServ.username,
			playerServ.id
		);
		playersList.push(player);
		entitiesList.push(player);
		if (player.id === socket.id) {
			playerLocal = player;
		}
	});
});

socket.on('navy', string => console.log(string));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function render(): void {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.save();

	if (playerLocal != null) {
		drawAliveEntities();
		rescaleContextDependingPlayerSize();
	}

	requestAnimationFrame(render);

	context.restore();
}

function rescaleContextDependingPlayerSize() {
	context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
	const scaleValue = (5 / playerLocal.getRadius()) * 25;
	context.scale(scaleValue, scaleValue);
	context.translate(-playerLocal.getXPosition(), -playerLocal.getYPosition());
}

function drawAliveEntities(): void {
	entitiesList.forEach(entity => {
		if (entity.isAlive()) {
			entity.drawDot();
		}
	});
}

// generateDots();
render();
setInterval(render, 1000 / 60);
