import express from 'express';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware';
import Player from '../../common/Player';
import Dot from '../../common/Dot';
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';
import { valueInRange } from '../../common/utils';

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

const SCENE_WIDTH: number = 2000;
const SCENE_HEIGHT: number = 2000;

/* ################################################## */

generateDots();
io.on('connection', socket => {
	console.log(`Connexion de l'utilisateur : ${socket.id}`);
	socket.emit('sendGameAssets', entitiesList);

	socket.emit('navy', `HEY ! LISTEN ! WATCH OUT ! HELLO !`);

	socket.on('joinGame', (username, colour) => {
		const x = Math.random() * SCENE_WIDTH;
		const y = Math.random() * SCENE_HEIGHT;

		const player: Player = new Player(
			x,
			y,
			50,
			colour,
			true,
			0,
			null,
			username,
			socket.id
		);
		player.setOnEatenListener(() => {
			socket.emit('gameOver', true);
		});
		playersList.push(player);
		entitiesList.push(player);
		io.emit('sendGameAssets', entitiesList);
	});

	socket.on(
		'sendMousePosition',
		(
			adjustedMouseCoefficientFromCenterX,
			adjustedMouseCoefficientFromCenterY,
			playerId
		) => {
			const player: Player = getPlayer(playerId);

			if (
				valueInRange(adjustedMouseCoefficientFromCenterX, -1, 1) &&
				valueInRange(adjustedMouseCoefficientFromCenterY, -1, 1)
			) {
				player.xPosition -= adjustedMouseCoefficientFromCenterX * 10;
				player.yPosition -= adjustedMouseCoefficientFromCenterY * 10;

				socket.emit(
					'sendNewPlayerPosition',
					player.xPosition,
					player.yPosition
				);
				eatFood(playerId);
				eatPlayer(playerId);
				io.emit('updateEntitiesList', entitiesList);
			}
		}
	);

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
}

function getPlayer(playerId: string): Player {
	for (const player of playersList) {
		if (player.getId() == playerId) {
			return player;
		}
	}
	return new Player(0, 0, 0, '', false, 0, null, 'NULLPLAYER', 'NULLPLAYER');
}

function generateDot(): Dot {
	let x = Math.random() * SCENE_WIDTH;
	let y = Math.random() * SCENE_HEIGHT;
	let colour = colors[Math.round(Math.random() * 3)];
	return new Dot(x, y, 10, colour, 1, true, null);
}

function calculDistanceBetweenPoints(pointA: Dot, pointB: Dot) {
	const xDistance: number = pointB.getXPosition() - pointA.getXPosition();
	const yDistance: number = pointB.getYPosition() - pointA.getYPosition();
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function eatFood(playerId: string): void {
	const player: Player = getPlayer(playerId);
	for (let i: number = 0; i < foodsList.length; i++) {
		if (foodsList[i] != null) {
			if (
				calculDistanceBetweenPoints(player, foodsList[i]) <=
				player.radius + foodsList[i].radius
			) {
				player.eats(foodsList[i]);
				const entityIdx = entitiesList.findIndex(
					entity => entity === foodsList[i]
				);
				entitiesList.splice(entityIdx, 1);
				if (!foodsList[i].isAlive()) {
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
