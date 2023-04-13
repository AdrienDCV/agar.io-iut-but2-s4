import Dot from './Dot';

export default class Player extends Dot {
	username: string;
	id: string;
	startPlaying: Date;

	constructor(
		xPosition: number,
		yPosition: number,
		radius: number,
		colour: string,
		alive: boolean,
		context: CanvasRenderingContext2D | null,
		username: string,
		id: string,
		startPlaying: Date
	) {
		super(xPosition, yPosition, radius, colour, 0, alive, context);
		this.username = username;
		this.id = id;
		this.isPlayer = true;
		this.startPlaying = startPlaying;
	}

	drawDot() {
		this.drawBotCircle();
		this.drawBotText();
	}

	private drawBotCircle() {
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

	private drawBotText() {
		if (!this.context) return;
		const fontSize = 16 * (this.radius / 100);
		const textWidth = this.context.measureText(this.username).width;
		const textPositionX = this.xPosition - textWidth / 2;
		const textPositionY = this.yPosition - this.radius - 10;
		this.context.font = `${fontSize}px serif`;

		this.context.fillText(this.username, textPositionX, textPositionY);
	}

	getUsername() {
		return this.username;
	}

	setUsername(username: string) {
		this.username = username;
	}

	setId(id: string) {
		this.id = id;
	}

	getId() {
		return this.id;
	}

	getStartPlaying() {
		return this.startPlaying;
	}

	setStartPlaying(startPlaying: Date) {
		this.startPlaying = startPlaying;
	}

	getTimePlayed(): number {
		const currentTime = new Date();
		console.log(currentTime.getMinutes());
		return currentTime.getMinutes() - this.getStartPlaying().getMinutes();
	}
}
