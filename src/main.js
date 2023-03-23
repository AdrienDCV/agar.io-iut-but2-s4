import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;
let you=new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0);	
let players=[new Player(200,200,40, new Color(`#AE1D23`), context, 'Parppaing', 0)];

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
let dot1=new Dot(300,300,10,new Color('green'),context);
you.drawDot();
dot1.drawDot();

let dots=[]
for(let i=1; i<10;i++){
    players[i]=new Player((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context);
}
for(let i=0;i<10;i++){
    players[i].drawDot();
}

window.onkeydown = move;
//window.onkeyup = stopMove;


function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	if(you!=null){
		you.drawDot();
	}
	for(let i=0;i<players.length;i++){
		if(players[i]!=null){
			players[i].drawDot();
		}
	}
    
	if(dot1!=null){
		dot1.drawDot();
	}
	
    
	requestAnimationFrame(render);
}

window.onkeydown = move;

function move(event) {
	if(you!=null){
	if (x < canvas.clientWidth - you.radius*2 && x >= 0) {
		if (event.code == 'ArrowRight') {
			console.log(event.code);
			you.xPosition += 5;
		}

		if (event.code == 'ArrowLeft') {
			console.log(event.code);
			you.xPosition -= 5;
		}
	}
	
	if (y < canvas.clientHeight - you.radius*2 && y >= 0) {
		if (event.code == 'ArrowDown') {
			console.log(event.code);
			you.yPosition += 5;
		}

		if (event.code == 'ArrowUp') {
			console.log(event.code);
			you.yPosition -= 5;
		}
	}
	
	x = you.xPosition;
	y = you.yPosition;
	
	for(let i=0;i<players.length;i++){
    	if(players[i]!=null){
    		if(you.xPosition===players[i].xPosition && you.yPosition===players[i].yPosition){
        		you.eats(players[0]);
    		}
		
		}
	}
	

	for(let i=0;i<players.length;i++){
		if(players[i]!=null && players[i].isEaten){
			players[i]=null;
			console.log('gagné');
		}
	}

	if(you.isEaten){
		console.log('perdu');
		you=null;
	}

	
    
	render();
	}
}



