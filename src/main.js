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


const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
let dot1=new Dot(300,300,60,new Color('green'),context);
let you=new Player((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),50,colors[Math.round(Math.random()*colors.length)],context,'you')

you.drawDot();
dot1.drawDot();

let dots=[]
you.drawDot();
dots.push(dot1);
for(let i=1; i<10;i++){
    dots[i]=new Dot((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context);
}

for(let i=0;i<dots.length;i++){
    dots[i].drawDot();
}

for(let i=0;i<players.length;i++){
	players[i].drawDot();
}
let size=200;

function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	if(you.radius>=size){
		you.radius-=10;
		for(let i=0;i<players.length;i++){
			if(players[i].radius>50){
				players[i].radius-=10;
			}
		}
		console.log("rescale");		
	}

	context.save();
	context.translate(canvas.width / 2-you.xPosition, canvas.height / 2-you.yPosition );
	playersDeplacements();
	
	for(let i=0;i<players.length;i++){
		if(players[i]!=null){
			players[i].drawDot();
		}
	}

	if(!you.isEaten){
		you.drawDot();
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
	if(players.length>0){
		players.forEach(player => player.drawDot());
	}
	you.drawDot();
	if (mousePosition.xPosition != undefined && mousePosition.yPosition != undefined) {
		//players.forEach(player => {			
		//	player.xPosition -= (player.xPosition - mousePosition.xPosition) * 0.005;
		//	player.yPosition -= (player.yPosition - mousePosition.yPosition) * 0.005;
		//	
		//});
		
		you.xPosition -= (you.xPosition - mousePosition.xPosition) * 0.005;
		you.yPosition -= (you.yPosition - mousePosition.yPosition) * 0.005;
	}

	for(let i=0;i<dots.length;i++){
		if(dots[i]!=null){
			
			if(calculDistance(you,dots[i])<=you.radius+dots[i].radius){
				you.eats(dots[i]);
				console.log(you.points);
				console.log(you.radius);
			}

			if(dots[i].isEaten){
				dots[i]=new Dot((Math.random()*canvas.clientWidth),(Math.random()*canvas.clientHeight),10,colors[Math.round(Math.random()*3)],context);				
			}

			
		}

		
	}
	
}

requestAnimationFrame(render);