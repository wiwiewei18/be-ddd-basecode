class Left<TLeftValue> {
	readonly value: TLeftValue;

	constructor(value: TLeftValue) {
		this.value = value;
	}

	isLeft(): this is Left<TLeftValue> {
		return true;
	}

	isRight(): this is Right<never> {
		return false;
	}
}

class Right<TRightValue> {
	readonly value: TRightValue;

	constructor(value: TRightValue) {
		this.value = value;
	}

	isLeft(): this is Left<never> {
		return false;
	}

	isRight(): this is Right<TRightValue> {
		return true;
	}
}

export type Either<TLeftValue, TRightValue> = Left<TLeftValue> | Right<TRightValue>;

export const left = <TLeftValue, TRightValue>(
	leftValue: TLeftValue,
): Either<TLeftValue, TRightValue> => {
	return new Left(leftValue);
};

export const right = <TRightValue>(rightValue: TRightValue): Either<never, TRightValue> => {
	return new Right<TRightValue>(rightValue);
};
