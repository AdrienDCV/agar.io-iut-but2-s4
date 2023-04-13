import Player from './Player';

export default class Dot {
	colour: string;
	radius: number;
	alive: boolean;
	points: number;
	xPosition: number;
	yPosition: number;
	context: CanvasRenderingContext2D | null;

	onEatenListener?: () => void;

	constructor(
		xPosition: number,
		yPosition: number,
		radius: number,
		colour: string,
		points: number,
		alive: boolean,
		context: CanvasRenderingContext2D | null
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
		if (!this.context) return;
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

	drawDotPlayer(username: string) {
		if (!this.context) return;
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
			this.setPoints(this.getPoints() + dotToEat.getPoints());
			this.setRadius(this.radius + dotToEat.getRadius() * 0.25);
			dotToEat.setAlive(false);
			if (dotToEat instanceof Player) {
				dotToEat.onEatenListener && dotToEat.onEatenListener();
			}
		}
	}

	setOnEatenListener(onEatenListener: () => void) {
		this.onEatenListener = onEatenListener;
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
