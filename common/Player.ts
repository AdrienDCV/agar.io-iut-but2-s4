import Dot from './Dot';

export default class Player extends Dot {
	private username: string;
	private id: string;

	constructor(
		xPosition: number,
		yPosition: number,
		radius: number,
		colour: string,
		alive: boolean,
		context: CanvasRenderingContext2D,
		username: string,
		id: string
	) {
		super(xPosition, yPosition, radius, colour, 0, alive, context);
		this.username = username;
		this.id = id;
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
}
