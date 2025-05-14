import type { UserEmail } from '@modules/user/domain/user/userEmail';
import { SuccessOrFailureResult } from '@shared/core/result';
import type { _UseCaseError } from '@shared/core/useCaseError';

export namespace SignUpErrors {
	export class EmailAlreadyTaken extends SuccessOrFailureResult<_UseCaseError> {
		constructor(email: UserEmail) {
			super(false, `The email ${email.value} for this account is already taken`);
		}
	}
}
