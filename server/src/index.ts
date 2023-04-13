import express from 'express';
import http from 'http';
import { Server as IOServer, Server } from 'socket.io';
import addWebpackMiddleware from './addWebpackMiddleware';
import { Zone } from '../../common/Playground/zone';
import { Entities } from '../../common/Entities/cell';
import { ClientToServerEvents } from '../../common/InterfaceIO/ClientToServer';
import { ServerToClientEvents } from '../../common/InterfaceIO/ServerToClient';
import ScoreboardHandler from '../../common/Scoreboard/ScoreboardLoader';

const fs = require('fs')
const path= require('path');
const app = express(),
	httpServer = http.createServer(app);

addWebpackMiddleware(app);
app.use(express.static('client/public'));

const io: Server<ClientToServerEvents, ServerToClientEvents> = new IOServer<ClientToServerEvents, ServerToClientEvents>(httpServer);

const game = new Zone.Playground(2000,2000, 150);

io.on('connection', socket => {

	// connexion
	socket.on('join', name => {
		console.log(`Nouvelle connexion du client ${socket.id}`);
		game.addPlayer(new Entities.Cell(Math.random()*game.width, Math.random()*game.height, socket.id, name));
		console.log(game.getCurrentGame());
	});

	socket.on('playerMoved', newData => {
		game.updatePlayerPos(socket.id, newData.newAngle, newData.globX, newData.globY);
	});

	// déconnexion
	socket.on('disconnect', () => {
		game.popPlayer(socket.id);
		console.log(game.getCurrentGame());
	});

	socket.emit('start');
});


setInterval(()=>{
	io.sockets.emit('currentGame', game.getCurrentGame());
	const eaten = game.updatePlayers();
	eaten.length > 0 ? game.updateScores(eaten): null;
	eaten.forEach(element => {
		io.sockets.emit('askRestart', (element));
	})
}, 1000 / 60);

setInterval(() => {
	io.sockets.emit('score', game.getScoreboard());
	fs.writeFile('client/public/scores.json', JSON.stringify(game.getScoreboard().json), (err: Error)=>{if(err) throw err;});
}, 3000)

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
