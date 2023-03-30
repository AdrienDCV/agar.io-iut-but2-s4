import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const players = [];
players.push(player1);
let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;
let you=new Player(100,400,30, new Color(`#FF0000`), context, 'Parppaing', 0);	

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
let dot1=new Dot(300,300,60,new Color('green'),context);
you.drawDot();
dot1.drawDot();

let dots=[]
dots.push(you);
dots.push(dot1);
for(let i=2; i<10;i++){
    dots[i]=new Dot((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context);
}

for(let i=0;i<dots.length;i++){
    dots[i].drawDot();
}

for(let i=0;i<players.length;i++){
	players[i].drawDot();
}


function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	context.save();
	context.translate(canvas.width / 2-players[0].xPosition, canvas.height / 2-players[0].yPosition );
	playersDeplacements();
	
	for(let i=0;i<players.length;i++){
		if(players[i]!=null){
			players[i].drawDot();
		}
	}

	for(let i=1;i<dots.length;i++){
		if(dots[i]!=null){
			dots[i].drawDot();
		}
	}
    

	
	context.restore();

	requestAnimationFrame(render);
	
}


function calculDistance(pointA,pointB){
	return Math.sqrt(Math.pow(pointB.xPosition-pointA.xPosition,2)+Math.pow(pointB.yPosition-pointA.yPosition,2));
}


let mousePosition = {xPosition: undefined, yPosition: undefined};
canvas.addEventListener('mousemove', event => {
	mousePosition = {xPosition: event.clientX, yPosition: event.clientY};
} );

function playersDeplacements() {

	players.forEach(player => player.drawDot());

	if (mousePosition.xPosition != undefined && mousePosition.yPosition != undefined) {
		players.forEach(player => {			
			player.xPosition -= (player.xPosition - mousePosition.xPosition) * 0.005;
			player.yPosition -= (player.yPosition - mousePosition.yPosition) * 0.005;

			
		}); 	
	}

	for(let i=0;i<dots.length;i++){
		if(dots[i]!=null){
			console.log(players[0].radius);
			if(calculDistance(players[0],dots[i])<=players[0].radius+dots[i].radius){
				
				players[0].eats(dots[i]);
			}

			if(dots[i].isEaten){
				dots[i]=new Dot((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context);				
			}

			if(players[0].radius>=500){
				players[0].radius-=10;
			}
		}

		
	}
	
}

requestAnimationFrame(render);