import type { JWTUserClaims } from '@modules/user/domain/jwt/jwt';
import { UserEmail } from '@modules/user/domain/user/userEmail';
import { UserMap } from '@modules/user/mapper/userMap';
import type { UserRepo } from '@modules/user/repos/userRepo/userRepo';
import type { AuthService } from '@modules/user/services/authService/authService';
import { type Either, left, right } from '@shared/core/either';
import type { SuccessOrFailure } from '@shared/core/result';
import type { UseCase } from '@shared/core/useCase';
import { SignInErrors } from './signInErrors';
import type { SignInResponseSchema } from './signInResponseSchema';

export type SignInRequest = {
	email: string;
	password: string;
};

export type SignInResponse = Either<SuccessOrFailure<unknown>, SignInResponseSchema>;

export class SignInUseCase implements UseCase<SignInRequest, SignInResponse> {
	constructor(
		private userRepo: UserRepo,
		private authService: AuthService,
	) {}

	async execute(input: SignInRequest): Promise<SignInResponse> {
		const emailOrError = UserEmail.create(input.email);
		if (emailOrError.isFailure) {
			return left(new SignInErrors.InvalidCredentials());
		}
		const email = emailOrError.getValue();

		const searchedUserByEmail = await this.userRepo.getUserByEmail(email);
		if (searchedUserByEmail.isNotFound) {
			return left(new SignInErrors.InvalidCredentials());
		}
		const user = searchedUserByEmail.getValue();

		const isValidPassword = user.password.comparePassword(input.password);
		if (!isValidPassword) {
			return left(new SignInErrors.InvalidCredentials());
		}

		const signJWT = this.authService.signJWT<JWTUserClaims>({
			userId: user.userId,
		});

		return right({
			user: UserMap.toDTO(user),
			token: {
				access: signJWT.token,
				expires: signJWT.expires.toISOString(),
			},
		});
	}
}
