import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { ValueObject } from '@shared/domain/valueObject';

export type UserNameProps = {
	value: string;
};

export class UserName extends ValueObject<UserNameProps> {
	get value() {
		return this.props.value;
	}

	static create(userName: string): SuccessOrFailure<UserName> {
		const nothingGuard = Guard.againstNothing(userName, 'UserName');
		if (nothingGuard.isFailure) {
			return Result.fail(`${nothingGuard.getErrorValue()} on create UserName`);
		}

		return Result.ok(new UserName({ value: userName }));
	}
}
