import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { ValueObject } from '@shared/domain/valueObject';
import bcrypt from 'bcryptjs';

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

	public getHashedValue(): string {
		return this.isAlreadyHashed() ? this.props.value : this.hashPassword(this.props.value);
	}

	public isAlreadyHashed(): boolean {
		return this.props.isHashed ?? false;
	}

	private hashPassword(userPassword: string): string {
		return bcrypt.hashSync(userPassword, 10);
	}

	public comparePassword(plainUserPassword: string): boolean {
		let hashedUserPassword: string;
		if (this.isAlreadyHashed()) {
			hashedUserPassword = this.props.value;
			return this.comparePasswordWithBcrypt(plainUserPassword, hashedUserPassword);
		}
		return this.props.value === plainUserPassword;
	}

	private comparePasswordWithBcrypt(plainUserPassword: string, hashedUserPassword: string) {
		try {
			return bcrypt.compareSync(plainUserPassword, hashedUserPassword);
		} catch (error) {
			return false;
		}
	}
}
