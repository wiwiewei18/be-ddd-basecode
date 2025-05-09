import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { ValueObject } from '@shared/domain/valueObject';

export type UserPasswordProps = {
	value: string;
	isHashed?: boolean;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
	get value() {
		return this.props.value;
	}

	static create(props: UserPasswordProps): SuccessOrFailure<UserPassword> {
		const nothingGuard = Guard.againstNothing(props.value, 'UserPassword');
		if (nothingGuard.isFailure) {
			return Result.fail(`${nothingGuard.getErrorValue()} on create User Password`);
		}

		return Result.ok(
			new UserPassword({
				value: props.value,
				isHashed: !!props.isHashed === true,
			}),
		);
	}
}
