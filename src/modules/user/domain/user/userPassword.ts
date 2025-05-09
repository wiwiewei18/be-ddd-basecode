import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { ValueObject } from '@shared/domain/valueObject';

export type UserPasswordProps = {
	value: string;
	isHashed?: boolean;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
	static minLength = 8;
	static maxLength = 50;

	get value() {
		return this.props.value;
	}

	static create(props: UserPasswordProps): SuccessOrFailure<UserPassword> {
		const nothingGuard = Guard.againstNothing(props.value, 'UserPassword');
		if (nothingGuard.isFailure) {
			return Result.fail(`${nothingGuard.getErrorValue()} on create User Password`);
		}

		if (!props.isHashed && !UserPassword.isAppropriateLength(props.value)) {
			return Result.fail(
				`Password doesn't meet criteria, min ${UserPassword.minLength} chars and max ${UserPassword.maxLength} chars`,
			);
		}

		return Result.ok(
			new UserPassword({
				value: props.value,
				isHashed: !!props.isHashed === true,
			}),
		);
	}

	private static isAppropriateLength(userPassword: string): boolean {
		return (
			userPassword.length >= UserPassword.minLength && userPassword.length <= UserPassword.maxLength
		);
	}
}
