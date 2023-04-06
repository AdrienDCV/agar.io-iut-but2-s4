import { Socket } from 'socket.io';
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../common/socketInterfaces';
import { io } from 'socket.io-client';

describe('join', () => {
	it(`should send to the client a list of players, a list of entities and a Player object representing the newly arrived player`, function () {
		const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
	});
});
