import { Socket } from 'socket.io';
import { io } from 'socket.io-client';

import Player from '../../common/Player';
import Dot from '../../common/Dot';
import Router from './Router';
// const socket: Socket = io();

const canvas: HTMLCanvasElement = document.querySelector(
	'.gameCanvas'
) as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext(
	'2d'
) as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const entities: Dot[] = [];
const players: Player[] = [];
const foods: Dot[] = [];

const player: Player = new Player(
	100,
	100,
	5,
	`#FF0000`,
	true,
	context,
	'Parppaing',
	'25052003'
);

const colors: string[] = [
	'#00FF15',
	'#FF0000',
	'#00FCFF',
	'#FF00FC',
	'#FCFF00',
	'#FF6C00',
];

//entities.push(player);
players.push(player);

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
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	// //rescale

	context.save();

	//context.translate(
	//	canvas.width / 2 - player.getXPosition(),
	//	canvas.height / 2 - player.getYPosition()
	//);

	context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
	const scaleValue = (5 / player.getRadius()) * 25;
	context.scale(scaleValue, scaleValue);
	context.translate(-player.xPosition, -player.yPosition);

	drawAliveEntities();
	playersDeplacements();

	context.restore();
}

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
	player.drawDot();
}

function playersDeplacements(): void {
	if (
		mousePosition.xPosition != undefined &&
		mousePosition.yPosition != undefined
	) {
		let newXPosition: number =
			(player.getXPosition() - mousePosition.xPosition) * 0.0125;
		player.xPosition -= newXPosition;

		let newYPosition: number =
			(player.getYPosition() - mousePosition.yPosition) * 0.0125;
		player.yPosition -= newYPosition;
		eatDotManager();
	}

	if (!player.isAlive()) {
		document.location.href = '/gameover.html';
	}
}

function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
	const xDistance: number = pointB.getXPosition() - pointA.getXPosition();
	const yDistance: number = pointB.getYPosition() - pointA.getYPosition();
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function eatDotManager(): void {
	for (let i: number = 0; i < foods.length; i++) {
		if (foods[i] != null) {
			if (
				calculDistanceBetweenPoints(player, foods[i]) <=
				player.getRadius() + foods[i].getRadius()
			) {
				player.eats(foods[i]);
				if (!foods[i].isAlive()) {
					foods[i] = generateDot();
					entities[i] = foods[i];
				}
				console.log(player.getRadius());
			}
		}
	}
}

generateDots();

setInterval(render, 1000 / 60);
