import Dot from "./Dot.ts";

export default class Player extends Dot {

    username;
    score;

    constructor(xPosition, yPosition, radius, colour, alive, context, username, score) {
        super(xPosition, yPosition, radius, colour, score, alive, context);
        this.username = username;
        this.score = score;
    }
    
    eats(dot) {
        if(dot.radius < this.radius){
            this.score += dot.points;
            dot.alive = false;
        }
        
    }
}