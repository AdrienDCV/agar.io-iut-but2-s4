import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;	
let players=[new Player(100,100,50, new Color(`#FF0000`), context, 'Parppaing', 0),
			 new Player(200,200,10, new Color(`#AE1D23`), context, 'Parppaing', 0)];

			 const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];
let dot1=new Dot(Math.random()*canvas.clientWidth,Math.random()*canvas.clientHeight,10,new Color('green'),context);


for(let i=0;i<players.length;i++){
    players[i].drawDot();
}
dot1.drawDot();

let dots=[]
for(let i=0; i<10;i++){
    dots[i]=new Dot(Math.random()*canvas.clientWidth,Math.random()*canvas.clientHeight,10,colors[Math.round(Math.random()*3)],context);
}
for(let i=0;i<10;i++){
    dots[i].drawDot();
}

window.onkeydown = move;
//window.onkeyup = stopMove;


function render() {
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	
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
    
	requestAnimationFrame(render);
}

window.onkeydown = move;

function move(event) {
	if (x < canvas.clientWidth - players[0].radius*2 && x >= 0) {
		if (event.code == 'ArrowRight') {
			console.log(event.code);
			players[0].xPosition += 5;
		}

		if (event.code == 'ArrowLeft') {
			console.log(event.code);
			players[0].xPosition -= 5;
		}
	}

	if (y < canvas.clientHeight - players[0].radius*2 && y >= 0) {
		if (event.code == 'ArrowDown') {
			console.log(event.code);
			players[0].yPosition += 5;
		}

		if (event.code == 'ArrowUp') {
			console.log(event.code);
			players[0].yPosition -= 5;
		}
	}

	x = players[0].xPosition;
	y = players[0].yPosition;
    if(players[1]!=null){
    	if(players[0].xPosition===players[1].xPosition && players[0].yPosition===players[1].yPosition){
        	players[0].eats(players[1]);
    	}
		
	}
	for(let i=0;i<dots.length;i++){
		if(dots[i]!=null){
			if(players[0].xPosition+players[0].radius===dots[i].xPosition && players[0].yPosition+players[0].radius===dots[i].yPosition){
				console.log(dots[i]);
				players[0].eats(dots[i]);
			}
			
		}
	}

	for(let i=0;i<players.length;i++){
		if(players[i]!=null && players[i].isEaten){
			players[i]=null;
		}
	}

	for(let i=0;i<dots.length;i++){
		if(dots[i]!=null && dots[i].isEaten){
			dots[i]
		}
	}
    
	render();
}



