import Color from "color";
import Dot from "./Dot.js";
import Player from "./Player.js";

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const entities = [];
const players = [];
const player1 = new Player(100,100,50, new Color(`#FF0000`), true, context, 'Parppaing', 0);
entities.push(player1);	
players.push(player1);
<<<<<<< HEAD:src/main.js
let x = 0;
let y = 0;
let xDirection = 0;
let yDirection = 0;
let you=new Player(100,400,30, new Color(`#FF0000`), context, 'Parppaing', 0);	
=======
>>>>>>> 13776e399657b3d5d711227e6f02246b414442df:client/src/main.js

const colors=[new Color('green'),new Color('yellow'),new Color('blue'),new Color('red')];

<<<<<<< HEAD:src/main.js
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
=======
function generateDots() {
	for(let i=1; i<2;i++){
		let x = (Math.random()*canvas.clientWidth);
		let y = (Math.random()*canvas.clientHeight);
		let colour = colors[Math.round(Math.random()*3)]
		entities[i] = (new Dot(x,y,10,colour,1, true,context));
	}
}	
>>>>>>> 13776e399657b3d5d711227e6f02246b414442df:client/src/main.js

generateDots();

function render() {
	
	context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	entities.forEach(entity => {
		if (entity.alive === true) {
			entity.drawDot();
		}
<<<<<<< HEAD:src/main.js
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
	
=======
	});
	playersDeplacements();
>>>>>>> 13776e399657b3d5d711227e6f02246b414442df:client/src/main.js
}

let mousePosition = {xPosition: undefined, yPosition: undefined};
canvas.addEventListener('mousemove', event => {
	mousePosition = {xPosition: event.clientX, yPosition: event.clientY};
} );

function playersDeplacements() {

	players.forEach(player => player.drawDot());

	if (mousePosition.xPosition != undefined && mousePosition.yPosition != undefined) {
		players.forEach(player => {			
			player.xPosition -= (player.xPosition - mousePosition.xPosition) * 0.0125;
			player.yPosition -= (player.yPosition - mousePosition.yPosition) * 0.0125;
		}); 		
		eatDotManager();
	}

	for(let i=1;i<dots.length;i++){
		if(dots[i]!=null){
			
		}

		if(dots[i].isEaten){
			dots[i]=null;
			
		}
	}
	
}

function eatDotManager() {
	entities.forEach(entity => {
		players.forEach(player => {
			if(player.xPosition+player.radius === entity.xPosition && player != entity){
				player.eats(entity);
				console.log(`entity eaten`);
			}
		})
	});
}

setInterval(render, 1000/60);