import Dot from "./Dot.js";

export default class Player extends Dot {

    #username;

    constructor(xPosition, yPosition, radius, colour, context, username, score) {
        super(xPosition, yPosition, radius, colour, context);
        this.username = username;
        this.score = score;
    }

    
    
}