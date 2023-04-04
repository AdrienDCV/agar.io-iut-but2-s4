import Player from './Player';

export interface ServerToClientEvents {
	sendPlayers: (playerList: Player[]) => void;
	sendLocalPlayer: (player: Player) => void;
	navy: (string: string) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	join: (
		username: string,
		colour: string,
		context: CanvasRenderingContext2D
	) => void;
}
