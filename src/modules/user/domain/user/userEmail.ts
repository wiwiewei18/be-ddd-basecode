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

		return Result.ok(new UserEmail({ value: UserEmail.format(userEmail) }));
	}

	private static format(userEmail: string) {
		return userEmail.trim().toLowerCase();
	}
}
