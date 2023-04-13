import Dot from './Dot';
import Player from './Player';

export interface ServerToClientEvents {
	sendPlayers: (playerList: Player[]) => void;
	navy: (string: string) => void;
	sendGameAssets: (entitiesList: (Dot | Player)[]) => void;
	sendNewPlayerPosition: (newXPosition: number, newYPosition: number) => void;
	updateEntitiesList: (entitiesList: (Dot | Player)[]) => void;
	gameOver: (alive: boolean) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	connect: () => void;
	joinGame: (
		username: string,
		colour: string,
		config: {
			height: number;
			width: number;
		}
	) => void;
	sendMousePosition: (
		mouseXPosition: number,
		mouseYPosition: number,
		playerId: string
	) => void;
}
