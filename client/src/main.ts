import { io , Socket} from 'socket.io-client';
import { Entities } from '../../common/Entities/cell.js';
import { ClientToServerEvents } from '../../common/InterfaceIO/ClientToServer.js';
import { ServerToClientEvents } from '../../common/InterfaceIO/ServerToClient.js';
import { Player } from "../../common/Playground/zone";
import { Food } from "../../common/Playground/zone";
import ScoreboardHandler from '../../common/Scoreboard/ScoreboardLoader.js';

type GameSize = {currentX: number, currentY: number, width: number, height: number, gridStep: number}; 
type ScorePart = {player: string, score: number}
// INIT

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const playbtn = document.querySelector('.playBtn');
const loginForm = document.querySelector('.login');
const backgroundBlur = document.querySelector('.connecting');
const playernameField = document.querySelector('.loginElementsCont input') as HTMLInputElement;

const restartForm = document.querySelector('.restartForm');
const restartBtn = document.querySelector('.restartBtn');
const restartInfos = document.querySelector('.status');

const crdBtn = document.querySelector('.crdBtn');

const displayScoreboardBtn = document.querySelector('.displayScore');
const hideScoreboardBtn = document.querySelector('.close');
const scoreboardPopup = document.querySelector('.popup');

const canvas = document.querySelector('.gameCanvas') as HTMLCanvasElement,
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D,
	rect = canvas.getBoundingClientRect() as DOMRect;

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = window.innerWidth; //canvas.clientWidth;
	canvas.height = window.innerHeight; //canvas.clientHeight;
}

const players: Player[] = [];
const foods: Food[] = [];
const gameSize: GameSize = {currentX: 0, currentY: 0, width: 0, height: 0, gridStep: 25};
const cam = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,
	zoom: 1
};

socket.on('currentGame', game => {
	players.splice(0, players.length);
	foods.splice(0, foods.length);
	players.push(...game.players);
	foods.push(...game.foods);
	gameSize.width = game.width;
	gameSize.height = game.height;
});

socket.on('start', () => {
	console.log('Started the game');
	restartInfos!.innerHTML = `<th>Time alive</th><th>Eaten food</th><th>Score</th>`;
	renderGame();
});

socket.on('askRestart', (player) => {
	if(player.id == socket.id){
		const diffTime = Math. abs((Date.now() - player.timeAlive)/3600000)*60*60;
		console.log(diffTime);
		restartForm?.classList.remove('invisible');
		restartInfos!.innerHTML += `<tr><td>${Math.floor(diffTime)}s</td><td>${player.foodCount}</td><td>${Math.floor(player.size)}</td></tr>`;
		backgroundBlur?.classList.remove('invisible');
	}
})

socket.on('score', (data) => {
	addScores(data);
})
/*
socket.on('scoreboard', element => {
	console.log(element);
})
*/
// EVENT RELATED

canvas.addEventListener('mousemove', event => {
	const myPlayer = getPlayer();
	const relativeX = event.clientX - rect.left;
	const relativeY = event.clientY - rect.top;
	const globX = relativeX / cam.zoom + cam.x;
	const globY = relativeY / cam.zoom + cam.y;
	const angle = (myPlayer == null ? -1 : Math.atan2(globX - myPlayer.x, globY - myPlayer.y));
	if(angle != -1 && myPlayer != null) {
		socket.emit('playerMoved', {
			newAngle: angle,
			globX: globX,
			globY: globY,
		});
	}
});

playbtn?.addEventListener('click', event => {
	event.preventDefault();
	if(playernameField.value.length > 0){
		loginForm?.classList.add('invisible');
		backgroundBlur?.classList.add('invisible');
		crdBtn?.classList.add('invisible');
		socket.emit('join', playernameField.value);
	}
})

displayScoreboardBtn?.addEventListener('click', event => {
	event.preventDefault();
	scoreboardPopup?.classList.add('visible');
	displayScoreboardBtn.classList.add('invisible');
})

hideScoreboardBtn?.addEventListener('click', event => {
	event.preventDefault();
	scoreboardPopup?.classList.remove('visible');
	displayScoreboardBtn?.classList.remove('invisible');
})

restartBtn?.addEventListener('click', event => {
	event.preventDefault();
	console.log('emitted')
	socket.emit('join',playernameField.value);
	restartForm?.classList.add('invisible');
	backgroundBlur?.classList.add('invisible');
})

crdBtn?.addEventListener('click', event => {
	window.location.replace('./credits.html');
})

// CANVAS RELATED - BELOW

function getPlayer(): Entities.Cell | null {
	//TODO: Verify if the following line with '!' is wrong ?
	let player = players.find(element => element.player.id == socket.id);
	return player?.player != undefined ? player.player : null;
}

function drawGrid (w: number, h: number, step: number): void {
	ctx.beginPath();
	for (let x = 0; x <= w; x += step) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
	}
	ctx.strokeStyle = 'rgb(215,215,215)';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.beginPath();
	for (let y = 0; y <= h; y += step) {
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
	}
	ctx.strokeStyle = 'rgb(215,215,215)';
	ctx.lineWidth = 1;
	ctx.stroke();
};

function renderGame(): void{	
	window.requestAnimationFrame(renderGame);
	let myPlayer = players.length > 0 ? getPlayer() : null;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//REALLY DRAW WHEN PLAYER IS READY TO PLAY
	if(myPlayer != null) {
		setAndUseCamera(myPlayer);
		drawGrid(gameSize.width,gameSize.height,gameSize.gridStep);	
		renderFood();
		renderOtherPlayersWhileAlive(myPlayer);
	}else {
		drawGrid(gameSize.width,gameSize.height,gameSize.gridStep);	
		renderFood();
		renderOtherPlayers();
	}
	renderNames();
	ctx.restore();
}

function setAndUseCamera(myPlayer: Entities.Cell){
	ctx.save();
	cam.x = myPlayer.x - canvas.width / (2 * cam.zoom);
	cam.y = myPlayer.y - canvas.height / (2 * cam.zoom);
	ctx.translate(-cam.x, -cam.y);
	ctx.scale(cam.zoom, cam.zoom);
}

function renderName(player: Entities.Cell){
	ctx.font = `${(player.size/2)+1}px Orbitron`;
	ctx.textAlign= "center";
	ctx.textBaseline="middle";
	ctx.fillStyle = 'rgb(0,0,0)'
  	ctx.fillText(player.name, player.x, player.y);
}

function renderPlayer(player: Entities.Cell): void {
	ctx.fillStyle = `rgb(${player.color.r},${player.color.g},${player.color.b})`;
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.size, 0, 360);
	ctx.fill();
}

function renderOtherPlayersWhileAlive(myPlayer: Entities.Cell): void {
	players.forEach(element => {
		if(element.player.size <= myPlayer.size && element.player.id != myPlayer.id){
			renderPlayer(element.player);
		}
	})
	renderPlayer(myPlayer);
	players.forEach(element => {
		if(element.player.size>myPlayer.size){
			renderPlayer(element.player);
		}
	})
}

function renderOtherPlayers(): void{
	players.forEach(element => {
		renderPlayer(element.player)
	});
}

function renderNames(): void{
	players.forEach(element => {
		renderName(element.player);
	})
}

function renderFood(): void{
	foods.forEach( element => {
		ctx.fillStyle = `rgb(${element.food.color.r},${element.food.color.g},${element.food.color.b})`;
		ctx.beginPath();
		ctx.arc(element.food.x, element.food.y, 5, 0, 360);
		ctx.fill();
	})
}

const scoreCont = document.querySelector('.scoreCont');

function addScores(json: ScoreboardHandler): void{
	scoreCont!.innerHTML = '<th>N°</th><th>Joueur</th><th>Score</th>';
	let idx = 0;
	json.json.forEach((element: ScorePart) => {
		scoreCont!.innerHTML += `<tr>
		<td>${++idx}</td><td>${element.player}</td><td>${element.score}</td>
		</tr>`;
	});
}