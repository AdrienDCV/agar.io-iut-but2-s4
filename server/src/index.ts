import express from 'express';
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

const canvasWidth: number = 1920;
const canvasHeight: number = 1080;
let canvasContext: CanvasRenderingContext2D;

/* ################################################## */

generateDots();
io.on('connection', socket => {
	console.log(`Connexion de l'utilisateur : ${socket.id}`);
	socket.emit('sendGameAssets', entitiesList, playersList);

	socket.emit('navy', `HEY ! LISTEN ! WATCH OUT ! HELLO !`);

	socket.on('joinGame', (username, colour, context) => {
		if (canvasContext == null) {
			canvasContext = context;
		}

		const x = Math.random() * canvasWidth;
		const y = Math.random() * canvasHeight;

		const player: Player = new Player(
			x,
			y,
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

	socket.on('sendMousePosition', (mouseXPosition, mouseYPosition, playerId) => {
		const player: Player = getPlayer(playerId);

		if (mouseXPosition != 0 && mouseYPosition != 0) {
			player.xPosition -= (player.getXPosition() - mouseXPosition) * 0.025;
			player.yPosition -= (player.getYPosition() - mouseYPosition) * 0.025;

			socket.emit('sendNewPlayerPosition', player.xPosition, player.yPosition);
			eatDot(playerId);
			eatPlayer(playerId);
			io.emit('updateEntitiesList', entitiesList);
		}
	});

	socket.on('disconnect', () => {
		removeDisconnectedPlayer(socket.id);
		console.log(`Déconnexion du client ${socket.id}`);
	});
});

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

/* ################################################## */

function removeDisconnectedPlayer(playerId: string) {
	playersList.forEach(player => {
		if (player.getId() === playerId) {
			playersList.splice(playersList.indexOf(player), 1);
			entitiesList.splice(playersList.indexOf(player), 1);
		}
	});
	io.emit('updateEntitiesList', entitiesList);
	io.emit('updatePlayersList', playersList);
}

function getPlayer(playerId: string): Player {
	for (const player of playersList) {
		if (player.getId() == playerId) {
			return player;
		}
	}
	return new Player(
		0,
		0,
		0,
		'',
		false,
		canvasContext,
		'NULLPLAYER',
		'NULLPLAYER'
	);
}

function generateDot(): Dot {
	let x = Math.random() * canvasWidth;
	let y = Math.random() * canvasHeight;
	let colour = colors[Math.round(Math.random() * 3)];
	return new Dot(x, y, 10, colour, 1, true, canvasContext);
}

function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
	const xDistance: number = pointB.getXPosition() - pointA.getXPosition();
	const yDistance: number = pointB.getYPosition() - pointA.getYPosition();
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function eatDot(playerId: string): void {
	const player: Player = getPlayer(playerId);
	for (let i: number = 0; i < foodsList.length; i++) {
		if (foodsList[i] != null) {
			if (
				calculDistanceBetweenPoints(player, foodsList[i]) <=
				player.radius + foodsList[i].radius
			) {
				player.eats(foodsList[i]);
				if (!foodsList[i].isAlive()) {
					entitiesList.splice(i, 1);
					foodsList[i] = generateDot();
					entitiesList.push(foodsList[i]);
				}
			}
		}
	}
}

function eatPlayer(playerId: string): void {
	const player: Player = getPlayer(playerId);
	for (let i: number = 0; i < playersList.length; i++) {
		if (playersList[i] != null && playersList[i].getId() != player.getId()) {
			if (
				calculDistanceBetweenPoints(player, playersList[i]) <=
				player.radius + playersList[i].radius
			) {
				player.eats(playersList[i]);
				playersList.splice(i, 1);
				entitiesList.splice(i, 1);
			}
		}
	}
}

function generateDots(): void {
	for (let i = 1; i <= 25; i++) {
		let dot = generateDot();
		foodsList.push(dot);
		entitiesList.push(dot);
	}
}
