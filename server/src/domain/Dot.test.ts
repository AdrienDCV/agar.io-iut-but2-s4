import Dot from '../common/Dot';

const dot1: Dot = new Dot(
	100,
	100,
	50,
	`#FF0000`,
	1,
	true,
	new CanvasRenderingContext2D()
);

const dot2: Dot = new Dot(
	100,
	100,
	25,
	`#FF0000`,
	1,
	true,
	new CanvasRenderingContext2D()
);

const dot3: Dot = new Dot(
	100,
	100,
	75,
	`#FF0000`,
	1,
	true,
	new CanvasRenderingContext2D()
);

describe('getColour', () => {
	it(`should return the colour of a dot`, function () {
		expect(dot1.getColour()).toEqual('#FF0000');
	});
});

describe('setColour', () => {
	it(`should modify the colour of a dot`, function () {
		dot1.setColour('#00FF15');
		expect(dot1.getColour()).toEqual('#00FF15');
	});
});

describe('getRadius', () => {
	it(`should return the radius of a dot`, function () {
		expect(dot1.getRadius()).toEqual(50);
	});
});

describe('setRadius', () => {
	it(`should modify the radius of a dot`, function () {
		dot1.setRadius(50);
		expect(dot1.getRadius()).toEqual(50);
	});
});

describe('isAliveTrue', () => {
	it(`should return true if a dot is alive`, function () {
		expect(dot1.isAlive()).toEqual(true);
	});
});

describe('setAlive', () => {
	it(`should modify the status of a dot`, function () {
		dot1.setAlive(false);
		expect(dot1.isAlive()).toEqual(false);
	});
});

describe('setRadius', () => {
	it(`should modify the radius of a dot`, function () {
		dot1.setRadius(50);
		expect(dot1.getRadius()).toEqual(50);
	});
});
