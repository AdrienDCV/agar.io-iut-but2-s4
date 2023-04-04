import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware';
import Player from '../../common/Player';
import {
	ClientToServerEvents,
	ServerToClientEvents,
} from '../../common/socketInterfaces';

const app = express(),
	httpServer = http.createServer(app);

addWebpackMiddleware(app); // compilation js client
app.use(express.static('client/public')); // fichiers statiques (html, css, js)

const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(httpServer);

const playersList: Player[] = [];

io.on('connection', socket => {
	console.log(`Connexion de l'utilisateur : ${socket.id}`);

	socket.emit('navy', `HEY ! LISTEN ! WATCH OUT ! HELLO !`);

	socket.on('join', (username, colour, context) => {
		const player: Player = new Player(
			100,
			100,
			50,
			colour,
			true,
			context,
			username,
			socket.id
		);
		playersList.push(player);
		socket.emit('sendLocalPlayer', player);
		io.emit('sendPlayers', playersList);
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
	});
});

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
