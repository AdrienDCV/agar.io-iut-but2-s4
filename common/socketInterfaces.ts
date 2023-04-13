import Dot from './Dot';
import Player from './Player';

export interface ServerToClientEvents {
	sendPlayers: (playerList: Player[]) => void;
	navy: (string: string) => void;
	sendGameAssets: (entitiesList: Dot[], playersList: Player[]) => void;
	sendNewPlayerPosition: (newXPosition: number, newYPosition: number) => void;
	updateEntitiesList: (entitiesList: Dot[]) => void;
	updatePlayersList: (playersList: Player[]) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	connect: () => void;
	joinGame: (
		username: string,
		colour: string,
		context: CanvasRenderingContext2D
	) => void;
	sendMousePosition: (
		mouseXPosition: number,
		mouseYPosition: number,
		playerId: string
	) => void;
}
