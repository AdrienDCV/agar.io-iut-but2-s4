import { io, Socket } from 'socket.io-client';

import Player from '../../common/Player';
import Dot from '../../common/Dot';

import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';

import { mapValue } from '../../common/utils';

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

const leaderboard = document.querySelector('.leaderboard') as HTMLElement;
const leaderboardList = leaderboard.querySelector(
	'.leaderboard-list'
) as HTMLElement;

creditsView.style.display = 'none';
gameOverView.style.display = 'none';
leaderboard.style.display = 'none';

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

let entitiesList: (Dot | Player)[] = [];

const mousePosition = {
	xPosition: 0,
	yPosition: 0,
};

canvas.addEventListener('mousemove', event => {
	mousePosition.xPosition = event.clientX;
	mousePosition.yPosition = event.clientY;
});

socket.on('sendGameAssets', entitiesListServ => {
	receivingEntities(entitiesListServ);
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
	leaderboard.style.display = '';
	joinGame(username, colour);
}

function joinGame(username: string, colour: string) {
	console.log('le joueur rejoint la partie');
	socket.emit('joinGame', username, colour, {
		height: canvas.height,
		width: canvas.width,
	});
}

function getLocalPlayer(player: Player) {
	if (player.id === socket.id) {
		playerLocal = player;
	}
}

function receivingEntities(entitiesListServ: Dot[]) {
	let entity: Dot | Player;
	entitiesList = [];
	entitiesListServ.forEach(entityServ => {
		if (entityServ.isPlayer) {
			const playerServ = entityServ as Player;
			entity = new Player(
				playerServ.xPosition,
				playerServ.yPosition,
				playerServ.radius,
				playerServ.colour,
				playerServ.alive,
				playerServ.points,
				context,
				playerServ.username,
				playerServ.id
			);
			getLocalPlayer(entity as Player);
		} else {
			entity = new Dot(
				entityServ.xPosition,
				entityServ.yPosition,
				entityServ.radius,
				entityServ.colour,
				1,
				entityServ.alive,
				context
			);
		}
		entitiesList.push(entity);
	});
}

function render(): void {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.save();

	if (playerLocal != null) {
		rescaleContextDependingPlayerSize();

		drawAliveEntities();
		sendingMousePosition();
		playerDeplacements();
	}

	gameOver();
	updateEntitiesList();
	updateLeaderboard();

	context.restore();
	// requestAnimationFrame(render);
}

function rescaleContextDependingPlayerSize() {
	context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
	const scaleFactor = (5 / playerLocal.getRadius()) * 25;
	context.scale(scaleFactor, scaleFactor);
	context.translate(-playerLocal.getXPosition(), -playerLocal.getYPosition());
}

function playerDeplacements() {
	socket.on('sendNewPlayerPosition', (newXPosition, newYPosition) => {
		playerLocal.xPosition = newXPosition;
		playerLocal.yPosition = newYPosition;

		document.body.style.backgroundPositionX = `${-newXPosition}px`;
		document.body.style.backgroundPositionY = `${-newYPosition}px`;
	});
}

function sendingMousePosition() {
	const adjustedMouseCoefficientFromCenterX = mapValue(
		mousePosition.xPosition,
		0,
		canvas.width,
		1,
		-1
	);
	const adjustedMouseCoefficientFromCenterY = mapValue(
		mousePosition.yPosition,
		0,
		canvas.height,
		1,
		-1
	);

	socket.emit(
		'sendMousePosition',
		adjustedMouseCoefficientFromCenterX,
		adjustedMouseCoefficientFromCenterY,
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

function gameOver() {
	socket.on('gameOver', bool => {
		gameOverView.style.display = '';
		const timer = gameOverView.querySelector('.timePlayed') as HTMLElement;
		const points = gameOverView.querySelector('.points') as HTMLElement;
		// console.log(playerLocal.getTimePlayed());
		// timer.innerHTML = `<h3>${playerLocal.getTimePlayed()} min</h3>`;
		points.innerHTML = `<h3>${playerLocal.getPoints()} points</h3>`;
	});
}

function updateLeaderboard() {
	const playersList: Player[] = entitiesList.filter(
		entity => entity.isPlayer
	) as Player[];
	playersList.sort((player1, player2) =>
		player1.getPoints() > player2.getPoints() ? 1 : -1
	);
	leaderboardList.innerHTML = playersList
		.slice(0, 5)
		.map(player => `<li>${player.getUsername()} : ${player.getPoints()}</li>`)
		.join('');
}

setInterval(render, 1000 / 60);
