// import { Socket } from 'socket.io-client';
// import Dot from '../../common/Dot';
// import Player from '../../common/Player';
// import {
// 	ClientToServerEvents,
// 	ServerToClientEvents,
// } from '../../common/socketInterfaces';
// import View from './View';

// export default class GameView extends View {
// 	canvas: HTMLCanvasElement;
// 	context: CanvasRenderingContext2D;
// 	socket: Socket<ServerToClientEvents, ClientToServerEvents>;

// 	playerLocal: Player;
// 	entitiesList: Dot[];
// 	playersList: Player[];
// 	mousePosition = {
// 		xPosition: 0,
// 		yPosition: 0,
// 	};

// 	constructor(element, socket) {
// 		super(element);
// 		this.canvas = this.element.querySelector(
// 			'.gameCanvas'
// 		) as HTMLCanvasElement;
// 		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
// 		this.playersList = [];
// 		this.entitiesList = [];
// 		this.socket = socket;
// 	}

// 	receivingPlayers(playersListServ: Player[]) {
// 		let player: Player;
// 		this.playersList = [];
// 		playersListServ.forEach(playerServ => {
// 			player = new Player(
// 				playerServ.xPosition,
// 				playerServ.yPosition,
// 				playerServ.radius,
// 				playerServ.colour,
// 				playerServ.alive,
// 				this.context,
// 				playerServ.username,
// 				playerServ.id
// 			);
// 			this.playersList.push(player);
// 			this.entitiesList.push(player);
// 			this.getLocalPlayer(player);
// 		});
// 	}

// 	getLocalPlayer(player: Player) {
// 		if (player.id === this.socket.id) {
// 			this.playerLocal = player;
// 		}
// 	}

// 	receivingEntities(entitiesListServ: Dot[]) {
// 		let entity: Dot;
// 		this.entitiesList = [];
// 		entitiesListServ.forEach(entityServ => {
// 			entity = new Dot(
// 				entityServ.xPosition,
// 				entityServ.yPosition,
// 				entityServ.radius,
// 				entityServ.colour,
// 				1,
// 				entityServ.alive,
// 				this.context
// 			);
// 			this.entitiesList.push(entity);
// 		});
// 	}

// 	rescaleContextDependingPlayerSize() {
// 		this.context.translate(
// 			this.canvas.clientWidth / 2,
// 			this.canvas.clientHeight / 2
// 		);
// 		const scaleValue = (5 / this.playerLocal.getRadius()) * 25;
// 		this.context.scale(scaleValue, scaleValue);
// 		this.context.translate(
// 			-this.playerLocal.getXPosition(),
// 			-this.playerLocal.getYPosition()
// 		);
// 	}

// 	playerDeplacements() {
// 		this.socket.on('sendNewPlayerPosition', (newXPosition, newYPosition) => {
// 			this.playerLocal.xPosition = newXPosition;
// 			this.playerLocal.yPosition = newYPosition;
// 		});
// 	}

// 	sendingMousePosition() {
// 		this.socket.emit(
// 			'sendMousePosition',
// 			this.mousePosition.xPosition,
// 			this.mousePosition.yPosition,
// 			this.playerLocal.getId()
// 		);
// 	}

// 	drawAliveEntities(): void {
// 		this.entitiesList.forEach(entity => {
// 			if (entity.isAlive()) {
// 				entity.drawDot();
// 			}
// 		});
// 	}

// 	updateEntitiesList() {
// 		this.socket.on('updateEntitiesList', entitiesListServ => {
// 			this.receivingEntities(entitiesListServ);
// 		});
// 	}

// 	updatePlayersList() {
// 		this.socket.on('updatePlayersList', playersListServ => {
// 			this.receivingPlayers(playersListServ);
// 		});
// 	}
// }
