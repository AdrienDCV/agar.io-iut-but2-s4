import { Color } from "colorette";

export default class Dot {

    private colour: Color;
    private radius: number;
    private alive: boolean;
    private xPosition: number;
    private yPosition: number;
    private context: CanvasRenderingContext2D;
    private points: number;

    constructor(xPosition: number, yPosition: number, radius: number, colour: Color, points: number, alive: boolean, context: CanvasRenderingContext2D) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.radius = radius;
        this.colour = colour;
        this.points = points;
        this.alive = alive;
        this.context = context;
    }

    drawDot() {
        this.context.strokeStyle = this.colour.toString();
        this.context.lineWidth = 4;
        this.context.fillStyle = this.colour.toString();
        this.context.beginPath();
        this.context.arc(this.xPosition, this.yPosition, this.radius, 360, 0);
        this.context.fill();
        this.context.stroke();
    }

}