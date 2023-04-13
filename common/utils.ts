export function mapValue(
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
) {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function valueInRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}
