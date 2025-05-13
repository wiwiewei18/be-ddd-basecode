import { User } from '@modules/user/domain/user/user';
import { UserEmail } from '@modules/user/domain/user/userEmail';
import { UserName } from '@modules/user/domain/user/userName';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import type { UserRepo } from '@modules/user/repos/userRepo/userRepo';
import { type Either, left, right } from '@shared/core/either';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import type { UseCase } from '@shared/core/useCase';

export type SignUpRequest = {
	name: string;
	email: string;
	password: string;
};

export type SignUpResponse = Either<SuccessOrFailure<unknown>, SuccessOrFailure<void>>;

export class SignUpUseCase implements UseCase<SignUpRequest, SignUpResponse> {
	constructor(private userRepo: UserRepo) {}

	async execute(input: SignUpRequest): Promise<SignUpResponse> {
		const nameOrError = UserName.create(input.name);
		const emailOrError = UserEmail.create(input.email);
		const passwordOrError = UserPassword.create({ value: input.password });

		const combinedSuccessOrFailure = Result.combineSuccessOrFailureResults([
			nameOrError,
			emailOrError,
			passwordOrError,
		]);
		if (combinedSuccessOrFailure.isFailure) {
			return left(combinedSuccessOrFailure);
		}

		const name = nameOrError.getValue();
		const email = emailOrError.getValue();
		const password = passwordOrError.getValue();

		const userOrError = User.create({
			name,
			email,
			password,
		});
		if (userOrError.isFailure) {
			return left(userOrError);
		}
		const user = userOrError.getValue();

		this.userRepo.save(user);

		return right(Result.ok());
	}
}
