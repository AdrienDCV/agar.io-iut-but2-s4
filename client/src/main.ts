import { io, Socket } from 'socket.io-client';

import Player from '../../common/Player';
import Dot from '../../common/Dot';

import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';
import Router from './Router';

// import CreditsView from './CreditsView';
// import GameView from './GameView';
// import GameOverView from './GameOverView';
// import LoginView from './LoginView';

const canvas: HTMLCanvasElement = document.querySelector(
	'.game .gameCanvas'
) as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context: CanvasRenderingContext2D = canvas.getContext(
	'2d'
) as CanvasRenderingContext2D;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

/* ################################### */
/*			    FRONT				   */
/* ################################### */
const loginView = document.querySelector('.viewContent .login') as HTMLElement;

const gameView = document.querySelector('.viewContent .game') as HTMLElement;

const gameOverView = document.querySelector(
	'.viewContent .gameOver'
) as HTMLElement;

const creditsView = document.querySelector(
	'.viewContent .credits'
) as HTMLElement;

creditsView.style.display = 'none';
gameOverView.style.display = 'none';

// // mise en place du Router
// const routes = [
// 	{ path: '/', view: loginView },
// 	{ path: '/game', view: gameView },
// 	{ path: '/gameOver', view: gameOverView },
// 	{ path: '/credits', view: creditsView },
// ];
// Router.routes = routes;

// // chargement de la vue initiale selon l'URL demandée par l'utilisateur.rice (Deep linking)
// Router.navigate(window.location.pathname, true);
// // gestion des boutons précédent/suivant du navigateur (History API)
// window.onpopstate = () => Router.navigate(document.location.pathname, true);

const creditsLink = loginView.querySelector('.creditsLink') as HTMLElement;
creditsLink.addEventListener('click', event => {
	event.preventDefault();
	loginView.style.display = 'none';
	creditsView.style.display = '';
});

creditsView.querySelector('.loginLink')?.addEventListener('click', event => {
	event?.preventDefault();
	console.log('passe par ici !!!!');
	creditsView.style.display = 'none';
	loginView.style.display = '';
});

/* ################################### */
/*				JEU					   */
/* ################################### */

let playerLocal: Player;

let entitiesList: Dot[] = [];
let playersList: Player[] = [];

const mousePosition = {
	xPosition: 0,
	yPosition: 0,
};

document.querySelector('.playBtn')?.addEventListener('click', event => {
	event.preventDefault();
	const usernameInput = document.querySelector(
		'.input-pseudo[type=text]'
	) as HTMLInputElement;
	const colourInput = document.querySelector(
		'.input-colour[type=color]'
	) as HTMLInputElement;
	const username: string = usernameInput.value;
	const colour: string = colourInput.value;
	loginView.style.display = 'none';
	event.preventDefault();
	joinGame(username, colour);
});

grid();

canvas.addEventListener('mousemove', event => {
	mousePosition.xPosition = event.clientX;
	mousePosition.yPosition = event.clientY;
});

socket.on('sendGameAssets', (entitiesListServ, playersListServ) => {
	receivingEntities(entitiesListServ);
	receivingPlayers(playersListServ);
});

function joinGame(username: string, colour: string) {
	console.log('le joueur rejoint la partie');
	socket.emit('joinGame', username, colour, context);
}

function receivingPlayers(playersListServ: Player[]) {
	let player: Player;
	playersList = [];
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
		getLocalPlayer(player);
	});
}

function getLocalPlayer(player: Player) {
	if (player.id === socket.id) {
		playerLocal = player;
	}
}

function receivingEntities(entitiesListServ: Dot[]) {
	let entity: Dot;
	entitiesList = [];
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
}

function render(): void {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.save();

	if (playerLocal != null) {
		console.log(playersList.length);
		rescaleContextDependingPlayerSize();

		drawAliveEntities();
		sendingMousePosition();
		playerDeplacements();
	}

	updateEntitiesList();
	updatePlayersList();

	context.restore();
	// requestAnimationFrame(render);

	if (!playerLocal.isAlive()) {
		gameOverView.style.display = '';
	}
}

function rescaleContextDependingPlayerSize() {
	context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
	const scaleValue = (5 / playerLocal.getRadius()) * 25;
	context.scale(scaleValue, scaleValue);
	context.translate(-playerLocal.getXPosition(), -playerLocal.getYPosition());
}

function playerDeplacements() {
	socket.on('sendNewPlayerPosition', (newXPosition, newYPosition) => {
		playerLocal.xPosition = newXPosition;
		playerLocal.yPosition = newYPosition;
	});
}

function sendingMousePosition() {
	socket.emit(
		'sendMousePosition',
		mousePosition.xPosition,
		mousePosition.yPosition,
		playerLocal.getId()
	);
}

function drawAliveEntities(): void {
	entitiesList.forEach(entity => {
		if (entity.isAlive()) {
			entity.drawDot();
		}
	});
}

function updateEntitiesList() {
	socket.on('updateEntitiesList', entitiesListServ => {
		receivingEntities(entitiesListServ);
	});
}

function updatePlayersList() {
	socket.on('updatePlayersList', playersListServ => {
		receivingPlayers(playersListServ);
	});
}

function grid() {
	const spaceBetweenLines = 50;
	for (let y = spaceBetweenLines; y < canvas.height; y += spaceBetweenLines) {
		context.moveTo(0, y);
		context.lineTo(canvas.width, y);
	}
	for (let x = spaceBetweenLines; x < canvas.width; x += spaceBetweenLines) {
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height);
	}
	context.stroke();
}
setInterval(render, 1000 / 60);
