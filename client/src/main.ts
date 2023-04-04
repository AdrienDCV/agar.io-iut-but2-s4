import { io, Socket } from 'socket.io-client';

import Player from '../../common/Player';
import Dot from '../../common/Dot';

import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';

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

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
socket.emit('join', 'Adrien', '#FF0000', context);

socket.on('sendPlayers', newPlayers => {
	players = newPlayers;
	newPlayers.forEach(newPlayer => {
		entities.push(newPlayer);
	});
});

socket.on('sendLocalPlayer', player => {
	playerLocal = player;
});

socket.on('navy', string => console.log(string));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors: string[] = [
	'#00FF15',
	'#FF0000',
	'#00FCFF',
	'#FF00FC',
	'#FCFF00',
	'#FF6C00',
];

const maxSize = 200;

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
	if (players != null) {
		entities.forEach(entity => {
			if (entity.isAlive() === true) {
				entity.drawDot();
			}
		});
		// // playersDeplacements();
		// context.restore();
		console.log(players.length);
	}
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	// context.save();
	// context.translate(
	// 	canvas.width / 2 - player.getXPosition(),
	// 	canvas.height / 2 - player.getYPosition()
	// );
	requestAnimationFrame(render);
}
render();

const mousePosition = {
	xPosition: 0,
	yPosition: 0,
};
canvas.addEventListener('mousemove', event => {
	mousePosition.xPosition = event.clientX;
	mousePosition.yPosition = event.clientY;
});

function drawAliveEntities(): void {
	entities.forEach(entity => {
		if (entity.isAlive() === true) {
			entity.drawDot();
		}
	});
}

// function playersDeplacements(): void {
// 	if (
// 		mousePosition.xPosition != undefined &&
// 		mousePosition.yPosition != undefined
// 	) {
// 		let newXPosition: number =
// 			(player.getXPosition() - mousePosition.xPosition) * 0.0125;
// 		player.xPosition -= newXPosition;

// 		let newYPosition: number =
// 			(player.getYPosition() - mousePosition.yPosition) * 0.0125;
// 		player.yPosition -= newYPosition;
// 		eatDotManager();
// 	}
// }

// function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
// 	const xDistance: number = pointB.getXPosition() - pointA.getXPosition();
// 	const yDistance: number = pointB.getYPosition() - pointA.getYPosition();
// 	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
// }

// function eatDotManager(): void {
// 	for (let i: number = 0; i < foods.length; i++) {
// 		if (foods[i] != null) {
// 			if (
// 				calculDistanceBetweenPoints(player, foods[i]) <=
// 				player.getRadius() + foods[i].getRadius()
// 			) {
// 				player.eats(foods[i]);
// 				foods[i] = generateDot();
// 			}
// 		}
// 	}
// }

generateDots();

// setInterval(render, 1000 / 60);
