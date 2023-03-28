export default class Dot {

    #colour;
    #radius;
    #xPosition;
    #yPosition;
    #context;
    #isEaten=false;

    constructor(xPosition, yPosition, radius, colour, context) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.radius = radius;
        this.colour = colour;
        this.context = context;
    }

    drawDot() {
        this.context.strokeStyle = this.colour;
        this.context.lineWidth = 4;
        this.context.fillStyle = this.colour;
        this.context.beginPath();
        this.context.arc(this.xPosition, this.yPosition, this.radius, 360, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    eats(dotEaten){
        if(dotEaten.radius>this.radius){
            dotEaten.eats(this);
        }
        else if(dotEaten.radius===this.radius){
            
        }
        else{
            this.radius+=dotEaten.radius;
            dotEaten.isEaten=true;
            console.log('eaten');
        }
    }

   

}