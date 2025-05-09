import { Result, type SuccessOrFailure } from './result';

export type GuardResponse = string;

export interface GuardArgument {
	argument: unknown;
	argumentName: string;
}

export type GuardArgumentCollection = GuardArgument[];

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Guard {
	public static greaterThan(
		minValue: number,
		actualValue: number,
	): SuccessOrFailure<GuardResponse> {
		return actualValue > minValue
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(
					`Number given {${actualValue}} is not greater than {${minValue}}`,
				);
	}

	public static greaterThanEqual(
		minValue: number,
		actualValue: number,
	): SuccessOrFailure<GuardResponse> {
		return actualValue >= minValue
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(
					`Number given {${actualValue}} is not greater than or equal {${minValue}}`,
				);
	}

	public static againstAtLeast(numChars: number, text: string): SuccessOrFailure<GuardResponse> {
		return text.length >= numChars
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(`Text is not at least ${numChars} chars.`);
	}

	public static againstAtMost(numChars: number, text: string): SuccessOrFailure<GuardResponse> {
		return text.length <= numChars
			? Result.ok<GuardResponse>()
			: Result.fail<GuardResponse>(`Text is greater than ${numChars} chars.`);
	}

	public static againstNothing(
		argument: unknown,
		argumentName: string,
	): SuccessOrFailure<GuardResponse> {
		if (argument === null || argument === undefined || argument === '') {
			return Result.fail<GuardResponse>(`${argumentName} is null or undefined`);
		}
		return Result.ok<GuardResponse>();
	}

	public static againstNothingBulk(args: GuardArgumentCollection): SuccessOrFailure<GuardResponse> {
		const invalidArg = args.find((arg) => {
			const result = Guard.againstNothing(arg.argument, arg.argumentName);
			return result.isFailure === true;
		});

		return invalidArg
			? Guard.againstNothing(invalidArg.argument, invalidArg.argumentName)
			: Result.ok<GuardResponse>();
	}

	public static isOneOf(
		value: unknown,
		validValues: unknown[],
		argumentName: string,
	): SuccessOrFailure<GuardResponse> {
		const isValid = validValues.includes(value);
		if (isValid) {
			return Result.ok<GuardResponse>();
		}
		return Result.fail<GuardResponse>(
			`${argumentName} isn't oneOf the correct types in ${JSON.stringify(
				validValues,
			)}. Got "${value}".`,
		);
	}

	public static inRange(
		num: number,
		min: number,
		max: number,
		argumentName: string,
	): SuccessOrFailure<GuardResponse> {
		const isInRange = num >= min && num <= max;
		if (!isInRange) {
			return Result.fail<GuardResponse>(`${argumentName} is not within range ${min} to ${max}.`);
		}
		return Result.ok<GuardResponse>();
	}

	public static allInRange(
		numbers: number[],
		min: number,
		max: number,
		argumentName: string,
	): SuccessOrFailure<GuardResponse> {
		const failingResult = numbers.find((num) => {
			const numIsInRangeResult = Guard.inRange(num, min, max, argumentName);
			return numIsInRangeResult.isFailure;
		});

		if (failingResult) {
			return Result.fail<GuardResponse>(`${argumentName} is not within the range.`);
		}
		return Result.ok<GuardResponse>();
	}
}
