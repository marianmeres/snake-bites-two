export const normalizeCoordinate = (value, max): number => {
	// negative
	if (value < 0) {
		let abs = Math.abs(value);
		if (abs > max) {
			abs = abs % max;
			if (!abs) return 0; // else continue below...
		}
		//
		return abs === max ? 0 : max - abs;
	}

	// positive or zero -> get remainder (modulo) if greater
	return value >= max ? value % max : value;
};
