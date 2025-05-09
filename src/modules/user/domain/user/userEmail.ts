import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { ValueObject } from '@shared/domain/valueObject';

export type UserEmailProps = {
	value: string;
};

export class UserEmail extends ValueObject<UserEmailProps> {
	get value() {
		return this.props.value;
	}

	static create(userEmail: string): SuccessOrFailure<UserEmail> {
		const nothingGuard = Guard.againstNothing(userEmail, 'userEmail');
		if (nothingGuard.isFailure) {
			return Result.fail(`${nothingGuard.getErrorValue()} on create UserEmail`);
		}

		if (!UserEmail.isValidEmail(userEmail)) {
			return Result.fail(`Email address is not in valid format`);
		}

		return Result.ok(new UserEmail({ value: UserEmail.format(userEmail) }));
	}

	private static isValidEmail(userEmail: string): boolean {
		const regex =
			/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(userEmail);
	}

	private static format(userEmail: string): string {
		return userEmail.trim().toLowerCase();
	}
}
