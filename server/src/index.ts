import express, { response } from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware';
import Player from '../../common/Player';
import Dot from '../../common/Dot';
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';

const app = express(),
	httpServer = http.createServer(app);

addWebpackMiddleware(app); // compilation js client
app.use(express.static('client/public')); // fichiers statiques (html, css, js)

const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(httpServer);

const colors: string[] = [
	'#00FF15',
	'#FF0000',
	'#00FCFF',
	'#FF00FC',
	'#FCFF00',
	'#FF6C00',
];

let entitiesList: Dot[] = [];
let playersList: Player[] = [];
let foodsList: Dot[] = [];

const canvasWidth: number = 1000;
const canvasHeight: number = 500;
let canvasContext: CanvasRenderingContext2D;

generateDots();
io.on('connection', socket => {
	console.log(`Connexion de l'utilisateur : ${socket.id}`);

	socket.emit('navy', `HEY ! LISTEN ! WATCH OUT ! HELLO !`);

	socket.on('join', (username, colour, context) => {
		if (canvasContext == null) {
			canvasContext = context;
		}
		const player: Player = new Player(
			100,
			100,
			50,
			colour,
			true,
			context,
			username,
			socket.id
		);
		playersList.push(player);
		entitiesList.push(player);
		io.emit('sendPlayers', playersList);
		io.emit('sendGameAssets', entitiesList, playersList);
	});

	socket.on('deplacements', (mouseXPosition, mouseYPosition, playerId) => {
		const player: Player = getPlayer(playerId);

		let newXPosition: number = (player.getXPosition() - mouseXPosition) * 0.001;

		let newYPosition: number = (player.getYPosition() - mouseYPosition) * 0.001;
		// eatDotManager();
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

function getPlayer(playerId: string): Player {
	playersList.forEach(player => {
		if (player.getId() === playerId) {
			return player;
		}
	});
	throw new Error(`No player found for id : ${playerId}`);
}

function generateDot(): Dot {
	let x = Math.random() * canvasWidth;
	let y = Math.random() * canvasHeight;
	let colour = colors[Math.round(Math.random() * 3)];
	return new Dot(x, y, 10, colour, 1, true, canvasContext);
}

function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
	const xDistance: number = pointB.getYPosition() - pointA.getXPosition();
	const yDistance: number = pointB.getYPosition() - pointA.getXPosition();
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function eatDotManager(playerId: string): void {
	const player: Player = getPlayer(playerId);

	for (let i: number = 0; i < foodsList.length; i++) {
		if (foodsList[i] != null) {
			if (
				calculDistanceBetweenPoints(player, foodsList[i]) <=
				player.getRadius() + foodsList[i].getRadius()
			) {
				player.eats(foodsList[i]);
				if (!foodsList[i].isAlive()) {
					foodsList[i] = generateDot();
					entitiesList[i] = foodsList[i];
				}
			}
		}
	}
}

function drawAliveEntities(): void {
	entitiesList.forEach(entity => {
		if (entity.isAlive()) {
			entity.drawDot();
		}
	});
}

function generateDots(): void {
	for (let i = 1; i <= 25; i++) {
		let dot = generateDot();
		foodsList.push(dot);
		entitiesList.push(dot);
	}
}
