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
window.addEventListener('resize', event => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

const context: CanvasRenderingContext2D = canvas.getContext(
	'2d'
) as CanvasRenderingContext2D;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

/* ################################### */
/*			    FRONT				   */
/* ################################### */
const loginView = document.querySelector('.viewContent .login') as HTMLElement;

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

loginView.querySelector('.playBtn')?.addEventListener('click', event => {
	event.preventDefault();
	startPlaying();
});

creditsView.querySelector('.loginLink')?.addEventListener('click', event => {
	event?.preventDefault();
	console.log('passe par ici !!!!');
	creditsView.style.display = 'none';
	loginView.style.display = '';
});

gameOverView
	.querySelector('.playAgainBtn')
	?.addEventListener('click', event => {
		startPlaying();
	});

gameOverView
	.querySelector('.loginLink > .menuLink')
	?.addEventListener('click', event => {
		event.preventDefault();
		loginView.style.display = '';
		gameOverView.style.display = 'none';
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

canvas.addEventListener('mousemove', event => {
	mousePosition.xPosition = event.clientX;
	mousePosition.yPosition = event.clientY;
});

socket.on('sendGameAssets', (entitiesListServ, playersListServ) => {
	receivingEntities(entitiesListServ);
	receivingPlayers(playersListServ);
});

function startPlaying() {
	const usernameInput = document.querySelector(
		'.input-pseudo'
	) as HTMLInputElement;
	const colourInput = document.querySelector(
		'.input-colour'
	) as HTMLInputElement;
	gameOverView.style.display = 'none';
	const username: string = usernameInput.value;
	const colour: string = colourInput.value;
	loginView.style.display = 'none';
	joinGame(username, colour);
}

function joinGame(username: string, colour: string) {
	console.log('le joueur rejoint la partie');
	socket.emit('joinGame', username, colour, {
		height: canvas.height,
		width: canvas.width,
	});
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
	console.log(player.id, socket.id);
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
		// console.log(playersList.length);

		rescaleContextDependingPlayerSize();

		drawAliveEntities();
		sendingMousePosition();
		playerDeplacements();
	}

	gameOver();
	updateEntitiesList();
	updatePlayersList();

	context.restore();
	// requestAnimationFrame(render);
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
		//const gameCanvasEl = document.querySelector('.game') as HTMLElement;
		//gameCanvasEl.style.backgroundPositionX = `${-(newXPosition / 10)}%`;
		//gameCanvasEl.style.backgroundPositionY = `${-(newYPosition / 10)}%`;
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

function gameOver() {
	socket.on('gameOver', bool => {
		console.log('<hDJfhsdhkfhjsdhfukzrfn,dsbhgfhsdhfjsd');

		gameOverView.style.display = '';
	});
}

setInterval(render, 1000 / 60);
