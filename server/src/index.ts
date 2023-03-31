import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware';

const app = express(),
	httpServer = http.createServer(app);

addWebpackMiddleware(app); // compilation js client
app.use(express.static('client/public')); // fichiers statiques (html, css, js)

const io = new IOServer(httpServer);

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
