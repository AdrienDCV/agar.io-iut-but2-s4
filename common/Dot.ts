export default class Dot {
	private colour: string;
	private radius: number;
	private alive: boolean;
	private points: number;
	xPosition: number;
	yPosition: number;
	private context: CanvasRenderingContext2D;

	constructor(
		xPosition: number,
		yPosition: number,
		radius: number,
		colour: string,
		points: number,
		alive: boolean,
		context: CanvasRenderingContext2D
	) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.radius = radius;
		this.colour = colour;
		this.points = points;
		this.alive = alive;
		this.context = context;
	}

	drawDot() {
		this.context.strokeStyle = this.colour;
		this.context.lineWidth = 4;
		this.context.fillStyle = this.colour;
		this.context.beginPath();
		this.context.arc(
			this.xPosition,
			this.yPosition,
			this.radius,
			0,
			2 * Math.PI,
			false
		);
		this.context.fill();
		this.context.stroke();
	}

	eats(dotToEat: Dot) {
		if (dotToEat.getRadius() < this.radius) {
			console.log('passe ici !');
			this.setPoints(this.getPoints() + dotToEat.getPoints());
			this.setRadius(this.radius + dotToEat.getRadius() * 0.25);
			dotToEat.setAlive(false);
		} else if (dotToEat.getRadius() > this.radius) {
			dotToEat.eats(this);
		}
	}

	getColour() {
		return this.colour;
	}

	setColour(colour: string) {
		this.colour = colour;
	}

	getRadius() {
		return this.radius;
	}

	setRadius(radius: number) {
		this.radius = radius;
	}

	isAlive() {
		return this.alive;
	}

	setAlive(status: boolean) {
		this.alive = status;
	}

	getPoints() {
		return this.points;
	}

	setPoints(points: number) {
		this.points = points;
	}

	getXPosition() {
		return this.xPosition;
	}

	setXPosition(xPosition: number) {
		this.xPosition = xPosition;
	}

	getYPosition() {
		return this.yPosition;
	}

	setYPosition(yPosition: number) {
		this.yPosition = yPosition;
	}

	getContext() {
		return this.context;
	}
}
