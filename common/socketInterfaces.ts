import Dot from './Dot';
import Player from './Player';

export interface ServerToClientEvents {
	sendPlayers: (playerList: Player[]) => void;
	navy: (string: string) => void;
	sendGameAssets: (entitiesList: Dot[], playersList: Player[]) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	join: (
		username: string,
		colour: string,
		context: CanvasRenderingContext2D
	) => void;
	deplacements: (
		mouseXPosition: number,
		mouseYPosition: number,
		playerId: string
	) => void;
}
