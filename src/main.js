import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const player1 = new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);
const players = [];
players.push(player1);
let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;
let you=new Player(100,400,30, new Color(`#FF0000`), context, 'Parppaing', 0);	

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
let dot1=new Dot(300,300,10,new Color('green'),context);
you.drawDot();
dot1.drawDot();

let dots=[]
dots.push(you);
for(let i=1; i<10;i++){
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
	playersDeplacements();
	if(you!=null){
		you.drawDot();
	}
	for(let i=0;i<players.length;i++){
		if(players[i]!=null){
			players[i].drawDot();
		}
	}

	for(let i=0;i<dots.length;i++){
		if(dots[i]!=null){
			dots[i].drawDot();
		}
	}
    
	if(dot1!=null){
		dot1.drawDot();
	}
	
    
	requestAnimationFrame(render);
	
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

	for(let i=1;i<dots.length;i++){
		if(dots[i]!=null){
			
		}

		if(dots[i].isEaten){
			dots[i]=null;
			
		}
	}
	
}

requestAnimationFrame(render);