import { SuccessOrFailureResult } from '@shared/core/result';
import type { _UseCaseError } from '@shared/core/useCaseError';

export namespace SignInErrors {
	export class InvalidCredentials extends SuccessOrFailureResult<_UseCaseError> {
		constructor() {
			super(false, `Invalid credentials. Please try again`);
		}
	}
}
