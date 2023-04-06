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

let entities: Dot[] = [];
let players: Player[] = [];
let foods: Dot[] = [];

let playerLocal: Player;

const colors: string[] = [
	'#00FF15',
	'#FF0000',
	'#00FCFF',
	'#FF00FC',
	'#FCFF00',
	'#FF6C00',
];

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

socket.on('sendPlayers', newPlayers => {
	let player: Player;
	newPlayers.forEach(newPlayer => {
		player = new Player(
			newPlayer.xPosition,
			newPlayer.yPosition,
			newPlayer.radius,
			newPlayer.colour,
			newPlayer.alive,
			context,
			newPlayer.username,
			newPlayer.id
		);
		players.push(player);
		entities.push(player);
		if (player.id === socket.id) {
			playerLocal = player;
		}
	});
});

socket.on('sendLocalPlayer', player => {
	playerLocal = player;
});

socket.on('navy', string => console.log(string));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function generateDot(): Dot {
	let x = Math.random() * canvas.clientWidth;
	let y = Math.random() * canvas.clientHeight;
	let colour = colors[Math.round(Math.random() * 3)];
	return new Dot(x, y, 10, colour, 1, true, context);
}

function generateDots(): void {
	for (let i = 1; i <= 25; i++) {
		let dot = generateDot();
		foods.push(dot);
		entities.push(dot);
	}
}

function render(): void {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.save();

	if (playerLocal != null) {
		context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
		const scaleValue = (5 / playerLocal.radius) * 25;
		context.scale(scaleValue, scaleValue);
		context.translate(-playerLocal.xPosition, -playerLocal.yPosition);

		drawAliveEntities();
		playersDeplacements();
	}

	requestAnimationFrame(render);

	context.restore();
}

function drawAliveEntities(): void {
	entities.forEach(entity => {
		if (entity.isAlive()) {
			entity.drawDot();
		}
	});
}

function rescaleContextDependingPlayerSize() {}

function playersDeplacements(): void {
	if (
		mousePosition.xPosition != undefined &&
		mousePosition.yPosition != undefined
	) {
		let newXPosition: number =
			(playerLocal.xPosition - mousePosition.xPosition) * 0.001;
		playerLocal.xPosition -= newXPosition;

		let newYPosition: number =
			(playerLocal.yPosition - mousePosition.yPosition) * 0.001;
		playerLocal.yPosition -= newYPosition;
		eatDotManager();
	}

	if (!playerLocal.isAlive) {
		document.location.href = '/gameover.html';
	}
}

function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
	const xDistance: number = pointB.yPosition - pointA.xPosition;
	const yDistance: number = pointB.yPosition - pointA.xPosition;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function eatDotManager(): void {
	for (let i: number = 0; i < foods.length; i++) {
		if (foods[i] != null) {
			if (
				calculDistanceBetweenPoints(playerLocal, foods[i]) <=
				playerLocal.radius + foods[i].radius
			) {
				playerLocal.eats(foods[i]);
				if (!foods[i].isAlive()) {
					foods[i] = generateDot();
					entities[i] = foods[i];
				}
			}
		}
	}
}

generateDots();
render();
setInterval(render, 1000 / 60);
